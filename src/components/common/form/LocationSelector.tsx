import { useState } from "react";
import {
    LocationService,
    Province,
    District,
    Ward,
} from "@/services/LocationService";
import "./LocationSelector.css";
import { CustomSelect, SelectOption } from "./CustomSelect";
import { useFormContext } from "react-hook-form";

interface LocationSelectorProps {
    onProvinceChange?: (id: number | null) => void;
    onDistrictChange?: (id: number | null) => void;
    onWardChange?: (id: number | null) => void;
    onFullLocationSelect?: (location: {
        provinceId: number | null;
        districtId: number | null;
        wardId: number | null;
    }) => void;
}

export const LocationSelector = (props: LocationSelectorProps = {}) => {
    const { setValue } = useFormContext();
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [loading, setLoading] = useState(false);

    const [selectedProvince, setSelectedProvince] = useState<number | null>(
        null
    );
    const [selectedDistrict, setSelectedDistrict] = useState<number | null>(
        null
    );
    const [selectedWard, setSelectedWard] = useState<number | null>(null);

    if (provinces.length === 0 && !loading) {
        (async () => {
            setLoading(true);
            try {
                const data = await LocationService.getProvinces();
                setProvinces(data);
            } catch (error) {
                console.log("Error fetching provinces" + error);
            } finally {
                setLoading(false);
            }
        })();
    }

    const provinceOptions: SelectOption[] = provinces.map((p) => ({
        label: p.name,
        value: p.id.toString(),
    }));

    const districtOptions: SelectOption[] = districts.map((d) => ({
        label: d.name,
        value: d.id.toString(),
    }));

    const wardOptions: SelectOption[] = wards.map((w) => ({
        label: w.name,
        value: w.id.toString(),
    }));

    const updateFullLocation = (
        p: number | null,
        d: number | null,
        w: number | null
    ) => {
        props.onFullLocationSelect?.({
            provinceId: p,
            districtId: d,
            wardId: w,
        });
    };

    const handleProvinceChange = async (e: React.FormEvent<HTMLDivElement>) => {
        const target = e.target as HTMLSelectElement;
        const id = Number(target.value) || null;

        setSelectedProvince(id);
        setSelectedDistrict(null);
        setSelectedWard(null);
        setDistricts([]);
        setWards([]);

        setValue("district", undefined);
        setValue("ward", undefined);

        props.onProvinceChange?.(id);
        updateFullLocation(id, null, null);

        if (id) {
            setLoading(true);
            try {
                const data = await LocationService.getDistricts(id);
                setDistricts(data);
            } catch (error) {
                console.log("Error fetching districts" + error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleDistrictChange = async (e: React.FormEvent<HTMLDivElement>) => {
        const target = e.target as HTMLSelectElement;
        const id = Number(target.value) || null;
        setSelectedDistrict(id);
        setSelectedWard(null);
        setWards([]);

        setValue("ward", undefined);

        props.onDistrictChange?.(id);
        updateFullLocation(selectedProvince, id, null);

        if (id) {
            setLoading(true);
            try {
                const data = await LocationService.getWards(id);
                setWards(data);
            } catch (error) {
                console.log("Error fetching wards" + error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleWardChange = (e: React.FormEvent<HTMLDivElement>) => {
        const target = e.target as HTMLSelectElement;
        const id = Number(target.value) || null;
        setSelectedWard(id);

        props.onWardChange?.(id);
        updateFullLocation(selectedProvince, selectedDistrict, id);
    };

    return (
        <div className="location-selector">
            <CustomSelect
                name="province"
                label="Chọn tỉnh"
                placeholder="Chọn tỉnh"
                optionsList={provinceOptions}
                value={[selectedProvince?.toString() || ""]}
                onChange={(e) => handleProvinceChange(e)}
            />
            <CustomSelect
                name="district"
                label="Chọn huyện"
                placeholder="Chọn huyện"
                optionsList={districtOptions}
                value={[selectedDistrict?.toString() || ""]}
                onChange={(e) => handleDistrictChange(e)}
                disabled={!districts.length}
            />
            <CustomSelect
                name="ward"
                label="Chọn xã"
                placeholder="Chọn xã"
                optionsList={wardOptions}
                value={[selectedWard?.toString() || ""]}
                onChange={(e) => handleWardChange(e)}
                disabled={!wards.length}
            />
        </div>
    );
};

export default LocationSelector;
