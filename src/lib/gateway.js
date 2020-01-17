import axios from 'axios'
import { isUndefined } from "lodash"


function proxyResponse (statusCode, data) {
    return {
       statusCode,
       data
    }
   }

const Gateway = {

  async request(url,data,method) {
    const urlBase = "https://localhost:44313/v1/ScheduleMeetings";
    const urlRequest = isUndefined(url) ? urlBase : urlBase + url;
    
    try {
      const dataHeaders =  {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'mode':'cors'
      };

      switch(method){
        case "POST": {
          const response = await axios.post(urlRequest, data, { headers: dataHeaders })
          return proxyResponse(response.status, response.data)
        }
        case "GET":
        default:  {
          const response = await axios.get(urlRequest, { headers: dataHeaders })
          return proxyResponse(response.status, response.data)
        }
      }

    } catch (error) {
      return proxyResponse(error.response.status, error)
    }
  }
}

export default Gateway
