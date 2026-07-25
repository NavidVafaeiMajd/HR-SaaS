import api from "@/api/axios";

export const useGetRowsToTable = async (url: string): Promise<{ data: any[] }> => {
   try {
    const res = api.get(url)
     
     if ((await res).status == 500) {
       throw new Error(`Failed to fetch data: ${(await res).status} ${(await res).statusText}`);
     }
     
     const result = await (await res).data;
     
     // Ensure we always return { data: array } structure
     return {
       data: Array.isArray(result?.data) ? result.data : (Array.isArray(result) ? result : [])
     };
   } catch (error) {
     return { data: [] };
   }
};
 