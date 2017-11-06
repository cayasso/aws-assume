# aws-assume

Generate temporary credentials for AWS IAM assumed roles.

Very usefull when working with tools like [Serverless](http://serverless.com/) and
[Apex](http://apex.run/) for deploying your Lambda code.

The temporary credentials are sent to stdout and can be evaled to use them
as environment variables in Bash commands.

## Usage

```bash
$ aws-assume <profile>
```

## Installation

### As part of your Node project
`npm install aws-assume --save`

#### Usage as a standalone CLI script
```javascript
# package.json
...
    "scripts": {
        "deploy": "eval \"`aws-assume` apex deploy\""
    }
...
```

#### Usage as a module
```javascript
import {assumeRole, getProfile, awsConfig} from 'aws-assume'
import AWS from 'aws-sdk'

...
// aws-assume exposes the AWS SDK global configuration object
// so you can customize details such as proxies, loggers and retry options
awsConfig.update({
    httpOptions: { 
        agent: myProxy
    }
});

assumeRole(getProfile())
.then(credentials => {
    AWS.config.credentials = credentials
    // ...
})
```

### Install globally
```bash
npm install -g aws-assume
eval "`aws-assume <profile>` npm run deploy"
```

The AWS profile is selected by the first criteria of these that matches:

1. passing a string after the `aws-assume` command
2. `AWS_PROFILE` environment variable
3. `default` as the default

If you choose to use `AWS_PROFILE` make sure that you are passing the environment
variable to the (sub)shell that calls `aws-assume`.

For example:

`export AWS_PROFILE && eval \"`aws-assume` apex deploy\"`

## Requirements

You must have an AWS profile setup in your `~/.aws/credentials` file similar to
the following:

```ini
[default]
aws_access_key_id = ABCDEFG
aws_secret_access_key = abcdefg
```

You should also have a role based configuration in your `~/.aws/config` file:

```ini
[profile default]
output = json
region = us-east-1
role_arn = arn:aws:iam::1234567890:role/DesiredRoleName
source_profile = default
```

# Credits

This project is heavely based on [aws-auth-helper](https://github.com/CoffeeAndCode/aws-auth-helper) but without the MFA part and some small variations.

# License

The MIT License (MIT)

Copyright (c) 2016 Jonathan Brumley

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
