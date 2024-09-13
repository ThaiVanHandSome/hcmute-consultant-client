import { LocationType } from '@/types/location.type'
import { SuccessResponse } from '@/types/utils.type'
import http from '@/utils/http'

export const getProvinces = () => http.get<SuccessResponse<LocationType[]>>('address/provinces')

export const getDistricts = (provinceCode: string) =>
  http.get<SuccessResponse<LocationType[]>>('address/districts', {
    params: {
      provinceCode
    }
  })

export const getWards = (districtCode: string) =>
  http.get<SuccessResponse<LocationType[]>>('address/wards', {
    params: {
      districtCode
    }
  })
