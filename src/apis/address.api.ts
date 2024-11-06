import { DistrictQueryConfig } from '@/hooks/useDistrictQueryConfig'
import { ProvinceQueryConfig } from '@/hooks/useProvinceQueryConfig'
import { WardQueryConfig } from '@/hooks/useWardQueryConfig'
import { DistrictType, ProvinceType, WardType } from '@/types/location.type'
import { PaginationResponse, SuccessResponse } from '@/types/utils.type'
import http from '@/utils/http'

export const getDistrictAdmin = (params: DistrictQueryConfig) =>
  http.get<SuccessResponse<PaginationResponse<DistrictType[]>>>('admin/district/list', {
    params
  })

export const addDistrictAdmin = (district: DistrictType) =>
  http.post<SuccessResponse<string>>(
    'admin/district/create',
    {
      name: district.name,
      nameEn: district.nameEn,
      fullName: district.fullName,
      fullNameEn: district.fullNameEn,
      codeName: district.codeName
    },
    {
      params: {
        provinceCode: district.provinceCode,
        code: district.code
      }
    }
  )

export const updateDistrictAdmin = (district: DistrictType) =>
  http.put<SuccessResponse<string>>(
    'admin/district/update',
    {
      name: district.name,
      nameEn: district.nameEn,
      fullName: district.fullName,
      fullNameEn: district.fullNameEn,
      codeName: district.codeName
    },
    {
      params: {
        provinceCode: district.provinceCode,
        code: district.code
      }
    }
  )

export const deleteDistrictAdmin = (code: string) =>
  http.delete<SuccessResponse<string>>('admin/district/delete', {
    params: {
      code
    }
  })

export const getWardAdmin = (params: WardQueryConfig) =>
  http.get<SuccessResponse<PaginationResponse<WardType[]>>>('admin/ward/list', {
    params
  })

export const addWardAdmin = (ward: WardType) =>
  http.post<SuccessResponse<string>>(
    'admin/ward/create',
    {
      name: ward.name,
      nameEn: ward.nameEn,
      fullName: ward.fullName,
      fullNameEn: ward.fullNameEn,
      codeName: ward.codeName
    },
    {
      params: {
        districtCode: ward.districtCode,
        code: ward.code
      }
    }
  )

export const updateWardAdmin = (ward: WardType) =>
  http.put<SuccessResponse<string>>(
    'admin/ward/update',
    {
      name: ward.name,
      nameEn: ward.nameEn,
      fullName: ward.fullName,
      fullNameEn: ward.fullNameEn,
      codeName: ward.codeName
    },
    {
      params: {
        districtCode: ward.districtCode,
        code: ward.code
      }
    }
  )

export const deleteWardAdmin = (code: string) =>
  http.delete<SuccessResponse<string>>('admin/ward/delete', {
    params: {
      code
    }
  })

export const getProvinceAdmin = (params: ProvinceQueryConfig) =>
  http.get<SuccessResponse<PaginationResponse<ProvinceType[]>>>('admin/province/list', {
    params
  })

export const addProvinceAdmin = (province: ProvinceType) =>
  http.post<SuccessResponse<string>>(
    'admin/province/create',
    {
      name: province.name,
      nameEn: province.nameEn,
      fullName: province.fullName,
      fullNameEn: province.fullNameEn,
      codeName: province.codeName
    },
    {
      params: {
        code: province.code
      }
    }
  )

export const updateProvinceAdmin = (province: ProvinceType) =>
  http.put<SuccessResponse<string>>(
    'admin/province/update',
    {
      name: province.name,
      nameEn: province.nameEn,
      fullName: province.fullName,
      fullNameEn: province.fullNameEn,
      codeName: province.codeName
    },
    {
      params: {
        code: province.code
      }
    }
  )

export const deleteProvinceAdmin = (code: string) =>
  http.delete<SuccessResponse<string>>('admin/province/delete', {
    params: {
      code
    }
  })
