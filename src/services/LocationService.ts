import { Configuration } from "./api/configuration";
import { UserApi } from "./api";

export interface Province {
    id: number;
    name: string;
}
export interface District {
    id: number;
    name: string;
    province_id: number;
}
export interface Ward {
    id: number;
    name: string;
    district_id: number;
}

const API_BASE_PATH = "http://123.25.21.16:8020/api";
const api = new UserApi(new Configuration({ basePath: API_BASE_PATH }));

export class LocationService {
    public static async getProvinces(): Promise<Province[]> {
        const response = await api.getProvinces();
        return response.data.data as Province[];
    }

    public static async getDistricts(provinceId: number): Promise<District[]> {
        const response = await api.getDistricts(provinceId);
        return response.data.data as District[];
    }

    public static async getWards(districtId: number): Promise<Ward[]> {
        const response = await api.getWards(districtId);
        return response.data.data as Ward[];
    }
}
