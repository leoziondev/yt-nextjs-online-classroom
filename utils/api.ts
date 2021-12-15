import axios, { AxiosResponse } from 'axios'

const api = async (path: string): Promise<AxiosResponse<any, any>> => {
    return axios.get(path)
}

export default api