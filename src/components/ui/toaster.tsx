import React, {
    useState,
    useEffect,
    createContext,
    useContext,
    useRef,
} from "react";

type ToastStatus = "success" | "error" | "warning" | "info";

interface Toast {
    id: string;
    title: string;
    description: string;
    status: ToastStatus;
    createdAt: number;
}

let globalToastCallback:
    | ((toast: Omit<Toast, "id" | "createdAt">) => void)
    | null = null;

interface ToasterState {
    toasts: Toast[];
    toast: (toast: Omit<Toast, "id" | "createdAt">) => void;
    removeToast: (id: string) => void;
}

const initialState: ToasterState = {
    toasts: [],
    toast: () => {},
    removeToast: () => {},
};

export const ToasterContext = createContext<ToasterState>(initialState);

export const useToaster = () => {
    const context = useContext(ToasterContext);
    if (!context) {
        throw new Error("useToaster must be used within a ToasterProvider");
    }
    return context;
};

export const ToasterProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const toastsTimeoutRef = useRef<{ [id: string]: number }>({});
    const [hoveredToastId, setHoveredToastId] = useState<string | null>(null);

    useEffect(() => {
        return () => {
            Object.values(toastsTimeoutRef.current).forEach(clearTimeout);
        };
    }, []);

    const removeToast = (id: string) => {
        setToasts((currentToasts) =>
            currentToasts.filter((toast) => toast.id !== id)
        );

        if (toastsTimeoutRef.current[id]) {
            clearTimeout(toastsTimeoutRef.current[id]);
            delete toastsTimeoutRef.current[id];
        }
    };

    const toast = (toastProps: Omit<Toast, "id" | "createdAt">) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast = { ...toastProps, id, createdAt: Date.now() };

        setToasts((currentToasts) => [...currentToasts, newToast]);

        const scheduleRemoval = () => {
            toastsTimeoutRef.current[id] = setTimeout(() => {
                if (hoveredToastId !== id) {
                    removeToast(id);
                }
            }, 3000);
        };

        scheduleRemoval();
    };

    useEffect(() => {
        globalToastCallback = toast;

        toasts.forEach((toastItem) => {
            if (toastsTimeoutRef.current[toastItem.id]) {
                clearTimeout(toastsTimeoutRef.current[toastItem.id]);
            }

            if (hoveredToastId !== toastItem.id) {
                toastsTimeoutRef.current[toastItem.id] = setTimeout(() => {
                    if (hoveredToastId !== toastItem.id) {
                        removeToast(toastItem.id);
                    }
                }, 3000);
            }
        });

        return () => {
            globalToastCallback = null;
        };
    }, [hoveredToastId, toasts, removeToast, toast]);

    return (
        <ToasterContext.Provider value={{ toasts, toast, removeToast }}>
            {children}
            <Toaster
                hoveredToastId={hoveredToastId}
                setHoveredToastId={setHoveredToastId}
            />
        </ToasterContext.Provider>
    );
};

export const Toaster: React.FC<{
    hoveredToastId: string | null;
    setHoveredToastId: (id: string | null) => void;
}> = ({ setHoveredToastId }) => {
    const { toasts, removeToast } = useToaster();

    const getToastStyles = (status: ToastStatus): React.CSSProperties => {
        const baseStyles: React.CSSProperties = {
            padding: "12px 16px",
            borderRadius: "4px",
            marginBottom: "8px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "350px",

            position: "relative",
            animation: "slideInRight 0.3s ease-out forwards",
        };

        switch (status) {
            case "success":
                return {
                    ...baseStyles,
                    backgroundColor: "#10b981",
                    color: "white",
                };
            case "error":
                return {
                    ...baseStyles,
                    backgroundColor: "#f43f5e",
                    color: "white",
                };
            case "warning":
                return {
                    ...baseStyles,
                    backgroundColor: "#f59e0b",
                    color: "white",
                };
            case "info":
                return {
                    ...baseStyles,
                    backgroundColor: "#3b82f6",
                    color: "white",
                };
            default:
                return baseStyles;
        }
    };

    if (toasts.length === 0) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: "70px",
                right: "20px",
                zIndex: 9999,
                display: "flex",
                flexDirection: "column-reverse",
                alignItems: "flex-end",
            }}
        >
            <style>
                {`
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
            </style>
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    style={getToastStyles(toast.status)}
                    onMouseEnter={() => setHoveredToastId(toast.id)}
                    onMouseLeave={() => setHoveredToastId(null)}
                >
                    <div>
                        <div
                            style={{ fontWeight: "bold", marginBottom: "4px" }}
                        >
                            {toast.title}
                        </div>
                        <div>{toast.description}</div>
                    </div>
                    <button
                        onClick={() => removeToast(toast.id)}
                        style={{
                            background: "transparent",
                            border: "none",
                            color: "currentColor",
                            cursor: "pointer",
                            marginLeft: "12px",
                            fontSize: "18px",
                        }}
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    );
};

export const toaster = {
    toast: (props: Omit<Toast, "id" | "createdAt">) => {
        if (globalToastCallback) {
            globalToastCallback(props);
        } else {
            console.warn(
                "ToasterProvider is not mounted or not yet initialized"
            );

            const toast = document.createElement("div");
            toast.style.position = "fixed";
            toast.style.top = "20px";
            toast.style.right = "20px";
            toast.style.backgroundColor =
                props.status === "error" ? "#f43f5e" : "#10b981";
            toast.style.color = "white";
            toast.style.padding = "12px 16px";
            toast.style.borderRadius = "4px";
            toast.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
            toast.style.zIndex = "9999";

            toast.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 4px;">${props.title}</div>
        <div>${props.description}</div>
      `;

            document.body.appendChild(toast);

            setTimeout(() => {
                document.body.removeChild(toast);
            }, 3000);
        }
    },
};
