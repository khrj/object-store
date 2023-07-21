<div align="center">
    <img src="assets/forest.png" width="700" alt="Autumn forest scene with boxes stacked on side of river and sunlight breaking through leaves">
    <h1>Object store</h1>
    <p>
        <b>Minimal API-based object store</b>
    </p>
    <br>
    <br>
    <br>
</div>

# API

-   [`GET /auth`](#get-auth)
-   [Buckets](#buckets)
    -   [`GET /buckets`](#get-buckets)
    -   [`PUT /buckets/:bucket`](#put-bucketsbucket)
    -   [`DELETE /buckets/:bucket`](#delete-bucketsbucket)
-   [Objects](#objects)
    -   [`GET /list/:bucket`](#get-listbucket)
    -   [`GET /object/:bucket/:object`](#get-objectbucketobject)
    -   [`DELETE /object/:bucket/:object`](#delete-objectbucketobject)
    -   [`POST /object/:bucket/:object`](#post-objectbucketobject)
    -   [`PATCH /object/:bucket/:object`](#patch-objectbucketobject)
-   [`GET /shared/:id`](#get-sharedid)

## Authentication

All API endpoints require authentication using a bearer token. To authenticate,
include the token in the `Authorization` header of your requests.

```
Bearer 6a29aaeec90a5a24abc879d0bb26f2ce656bf2...
```

### `GET /auth`

Returns a `204 No Content` response if the provided token is valid.

## Buckets

A bucket is a top-level directory that contains objects.

### `GET /buckets`

Returns a list of all buckets.

### `PUT /buckets/:bucket`

Creates a new bucket with the specified name.

### `DELETE /buckets/:bucket`

Deletes the bucket with the specified name.

## Objects

An object is a file or directory within a bucket.

### `GET /list/:bucket`

Returns a list of all objects in the specified bucket. You can optionally
provide a `path` query parameter to list objects within a subdirectory.

### `GET /object/:bucket/:object`

Returns the contents of the specified object. If the object is a file, the
contents are returned as a stream. If the object is a directory, a `404 Not
Found` response is returned.

### `DELETE /object/:bucket/:object`

Deletes the specified object.

### `POST /object/:bucket/:object`

Creates or updates the specified object. The request body should contain the
contents of the object. If the object already exists, it will be overwritten.

### `PATCH /object/:bucket/:object`

Creates a shareable link for an object.

## `GET /shared/:id`

Downloads the file associated with the specified shareable link.

## Error Codes

The API returns the following error codes:

-   `400 Bad Request`: The request is invalid.
-   `401 Unauthorized`: The provided token is invalid or missing.
-   `403 Forbidden`: The requested operation is not allowed.
-   `404 Not Found`: The requested resource does not exist.
-   `409 Conflict`: The requested operation conflicts with an existing resource.
-   `500 Internal Server Error`: An unexpected error occurred on the server.

## Development

To run the API locally, run the following command:

```
npm start
```

The API will listen on port `12543` by default.

## License

This project is licensed under the MIT License. See the `LICENSE` file for
details.
