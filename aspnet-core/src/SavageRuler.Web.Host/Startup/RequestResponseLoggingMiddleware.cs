using Castle.Core.Logging;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Internal;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SavageRuler.Web.Host.Startup
{
    public class RequestResponseLoggingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger _logger;

        public RequestResponseLoggingMiddleware(RequestDelegate next, ILoggerFactory loggerFactory)
        {
            _next = next;
            // perhaps it is middleware logger created with name "Default"
            _logger = loggerFactory.Create(typeof(RequestResponseLoggingMiddleware));
        }

        public async Task Invoke(HttpContext context)
        {
            bool addBody = _logger.IsDebugEnabled;

            //First, get the incoming request
            var request = await FormatRequest(context.Request, addBody);

            //Copy a pointer to the original response body stream
            var originalBodyStream = context.Response.Body;

            //Create a new memory stream...
            using (var responseBody = new MemoryStream())
            {
                //...and use that for the temporary response body
                context.Response.Body = responseBody;

                //Continue down the Middleware pipeline, eventually returning to this class
                try
                {
                    await _next(context);
                }
                catch (Exception e)
                {
                    _logger.Error(request + "\r\nException:", e);
                    throw;
                }
                //Format the response from the server
                var response = await FormatResponse(context.Response, addBody);

                _logger.Debug(request + "\r\n" + response);

                //Copy the contents of the new memory stream (which contains the response) to the original stream, which is then returned to the client.
                await responseBody.CopyToAsync(originalBodyStream);
            }
        }

        private async Task<string> FormatRequest(HttpRequest request, bool addBody)
        {
            var result =
$@"Request: 
{request.Method}
Path: {request.Scheme}://{request.Host}{request.Path}
Query: {request.QueryString}";
            // todo: (ToString for this return type)
//Header: {request.Headers.Select(pair => new { pair.Key, pair.Value })}
//Cookies: {request.Cookies}";

            if (!addBody) return result;

            var body = request.Body;

            //This line allows us to set the reader for the request back at the beginning of its stream.
            request.EnableRewind();

            //We now need to read the request stream.  First, we create a new byte[] with the same length as the request stream...
            var buffer = new byte[Convert.ToInt32(request.ContentLength)];

            //...Then we copy the entire request stream into the new buffer.
            await request.Body.ReadAsync(buffer, 0, buffer.Length);

            //We convert the byte[] into a string using UTF8 encoding...
            var text = Encoding.UTF8.GetString(buffer);

            //..and finally, assign the read body back to the request body, which is allowed because of EnableRewind()
            request.Body = body;

            return result + "\r\nBody:\r\n" + text;
        }

        private async Task<string> FormatResponse(HttpResponse response, bool addBody)
        {
            var result =
$@"Response:
Code: {response.StatusCode}";
            // todo: (ToString for this return type)

//Headers: {response.Headers}
//Cookies: {response.Cookies}";
            if (!addBody) return result;

            //We need to read the response stream from the beginning...
            response.Body.Seek(0, SeekOrigin.Begin);

            //...and copy it into a string
            string text = await new StreamReader(response.Body).ReadToEndAsync();

            //We need to reset the reader for the response so that the client can read it.
            response.Body.Seek(0, SeekOrigin.Begin);

            //Return the string for the response, including the status code (e.g. 200, 404, 401, etc.)
            return result + "\r\nBody:\r\n" + text;

        }
    }
}
