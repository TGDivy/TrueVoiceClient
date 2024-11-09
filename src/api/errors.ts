import { AxiosError } from "axios";

export class APIError extends Error {
  status: number;
  data: unknown;
  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

// type badRequestDataType = {
//   code: string;
//   message: string;
//   expected: string;
//   received: string;
//   path: {
//     key: string;
//     value: string;
//   };
// }[];

//  API Errors

//  Network Error
export class NetworkError extends APIError {
  constructor(message: string, data: unknown) {
    super(message, 0, data);
  }
}

// 404  Not Found Error
export class NotFoundError extends APIError {
  constructor(message: string, data: unknown) {
    super(message, 404, data);
  }
}

// 401  Not Authorized Error
export class NotAuthorizedError extends APIError {
  constructor(message: string, data: unknown) {
    super(message, 401, data);
  }

  redirect() {
    // Redirect the user
  }
}

// 400 Bad Request Error
export class BadRequestError extends APIError {
  constructor(message: string, data: unknown) {
    super(message, 400, data);
  }
}

// 422 Unprocessable Entity Error
export class UnprocessableEntityError extends APIError {
  constructor(message: string, data: unknown) {
    super(message, 422, data);
  }
}

// 405 Method Not Allowed Error
export class MethodNotAllowedError extends APIError {
  constructor(message: string, data: unknown) {
    super(message, 405, data);
  }
}

// 500+ Server Error
export class ServerError extends APIError {
  constructor(message: string, status: number, data: unknown) {
    super(message, status, data);
  }
}

// find message in data
// recursively search for message field in data, and append all messages as a single string
// const findMessage = (data: unknown): string => {
//   if (typeof data === "string") {
//     return data;
//   }
//   if (Array.isArray(data)) {
//     return data.map(findMessage).join(", ");
//   }
//   if (typeof data === "object" && data !== null) {
//     return findMessage(Object.values(data));
//   }
//   return "";
// };
// Just return the first message
const findMessage = (data: unknown): string => {
  if (typeof data === "string") {
    return data;
  }
  if (Array.isArray(data)) {
    return data.map(findMessage).join(", ");
  }
  if (typeof data === "object" && data !== null) {
    if (Object.prototype.hasOwnProperty.call(data, "message")) {
      return (data as { message: string }).message; // Type assertion added here
    }
    return findMessage(Object.values(data));
  }
  return "";
};

export const handleAxiosError = (error: AxiosError) => {
  if (!(error instanceof Error)) {
    throw new Error("Unknown error occurred.");
  }
  if (!("response" in error)) {
    throw new NetworkError("Network error occurred.", null);
  }

  if (error.response) {
    const { status, data } = error.response;
    if (status === 400) {
      const badRequestData = data;

      const message = findMessage(badRequestData);
      throw new BadRequestError(message, badRequestData);
    }
    if (status === 401) {
      throw new NotAuthorizedError("Unauthorized.", data);
    }
    if (status === 404) {
      throw new NotFoundError("Not found.", data);
    }
    if (status === 405) {
      throw new MethodNotAllowedError("Method not allowed.", data);
    }
    if (status === 422) {
      throw new UnprocessableEntityError("Unprocessable entity.", data);
    }
    if (status >= 500) {
      throw new ServerError("Server error occurred.", status, data);
    }
    throw new APIError("API error occurred.", status, data);
  }
};
