import { SuccessResponse } from "@/types/utils.type"
import http from "@/utils/http"

export const exportData = (params: any) => http.post<SuccessResponse<string>>('export', null, {
  params
}) 