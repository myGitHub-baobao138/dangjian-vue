import {server} from "../../../tools/servers";

// export const  getVerificationInfo=(data)=server.connection('GET','/DJAdminVerificationManagement/getVerificationInfo',data);
export const getVerificationInfo=(data)=>server.connection('GET','/System/DJAdminVerificationManagement/getVerificationInfo',data);
