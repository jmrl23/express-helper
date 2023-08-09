// https://www.npmjs.com/package/http-errors
import createHttpError, { HttpError, CreateHttpError } from 'http-errors';

export { createHttpError, HttpError, CreateHttpError };
export const BadRequest = createHttpError.BadRequest;
export const Unauthorized = createHttpError.Unauthorized;
export const PaymentRequired = createHttpError.PaymentRequired;
export const Forbidden = createHttpError.Forbidden;
export const NotFound = createHttpError.NotFound;
export const MethodNotAllowed = createHttpError.MethodNotAllowed;
export const NotAcceptable = createHttpError.NotAcceptable;
export const ProxyAuthenticationRequired =
  createHttpError.ProxyAuthenticationRequired;
export const RequestTimeout = createHttpError.RequestTimeout;
export const Conflict = createHttpError.Conflict;
export const Gone = createHttpError.Gone;
export const LengthRequired = createHttpError.LengthRequired;
export const PreconditionFailed = createHttpError.PreconditionFailed;
export const PayloadTooLarge = createHttpError.PayloadTooLarge;
export const URITooLong = createHttpError.URITooLong;
export const UnsupportedMediaType = createHttpError.UnsupportedMediaType;
export const RangeNotSatisfiable = createHttpError.RangeNotSatisfiable;
export const ExpectationFailed = createHttpError.ExpectationFailed;
export const ImATeapot = createHttpError.ImATeapot;
export const MisdirectedRequest = createHttpError.MisdirectedRequest;
export const UnprocessableEntity = createHttpError.UnprocessableEntity;
export const Locked = createHttpError.Locked;
export const FailedDependency = createHttpError.FailedDependency;
export const TooEarly = createHttpError.TooEarly;
export const UpgradeRequired = createHttpError.UpgradeRequired;
export const PreconditionRequired = createHttpError.PreconditionRequired;
export const TooManyRequests = createHttpError.TooManyRequests;
export const RequestHeaderFieldsTooLarge =
  createHttpError.RequestHeaderFieldsTooLarge;
export const UnavailableForLegalReasons =
  createHttpError.UnavailableForLegalReasons;
export const InternalServerError = createHttpError.InternalServerError;
export const NotImplemented = createHttpError.NotImplemented;
export const BadGateway = createHttpError.BadGateway;
export const ServiceUnavailable = createHttpError.ServiceUnavailable;
export const GatewayTimeout = createHttpError.GatewayTimeout;
export const HTTPVersionNotSupported = createHttpError.HTTPVersionNotSupported;
export const VariantAlsoNegotiates = createHttpError.VariantAlsoNegotiates;
export const InsufficientStorage = createHttpError.InsufficientStorage;
export const LoopDetected = createHttpError.LoopDetected;
export const BandwidthLimitExceeded = createHttpError.BandwidthLimitExceeded;
export const NotExtended = createHttpError.NotExtended;
export const NetworkAuthenticationRequire =
  createHttpError.NetworkAuthenticationRequire;
