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

## Instalation
```
# As part of your Node project
npm install aws-assume --save

# package.json
...
    "scripts": {
        "deploy": "eval \"`aws-assume` apex deploy\""
    }
...
```

```
# Installed globally
npm install -g aws-auth-helper
eval "`aws-auth-helper [aws-profile-name]` npm run deploy"
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

You should also have a role based configuration that uses MFA in your
`~/.aws/config` file:

```ini
[profile default]
mfa_serial = arn:aws:iam::1234567890:mfa/username
output = json
region = us-east-1
role_arn = arn:aws:iam::1234567890:role/DesiredRoleName
source_profile = default
```

# Credits

This project is heavely based on [aws-auth-helper](https://github.com/CoffeeAndCode/aws-auth-helper) but without the MFA part and some small variations.
