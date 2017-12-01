#!/usr/bin/env node

'use strict'
import 'babel-polyfill'
import { Credentials, SharedIniFileCredentials, STS } from 'aws-sdk'
import { join, dirname } from 'path'
import { readFileSync } from 'fs'
import { parse } from 'ini'
import { homedir } from 'os'
export { config as awsConfig } from 'aws-sdk';

export function assumeRole(profile) {
  const creds = new SharedIniFileCredentials({ profile })

  const awsProfileDir = creds.filename ? dirname(creds.filename) : join(homedir(), '.aws')
  const file = process.env.AWS_CONFIG_FILE || join(awsProfileDir, 'config')

  const config = parse(readFileSync(file, 'utf-8'))[`profile ${profile}`]
  const sts = new STS()

  const options = {
    RoleArn: config.role_arn,
    RoleSessionName: `${profile}-${Date.now()}`
  }

  return new Promise((resolve, reject) => {
    sts.assumeRole(options, (error, response) => {
      if (error) reject(error)
      else resolve(new Credentials(response.Credentials.AccessKeyId, response.Credentials.SecretAccessKey, response.Credentials.SessionToken))
    })
  })
}

export function getProfile() {
  return process.env.AWS_PROFILE || 'default'
}

export default async (profile) => {
  process.stderr.write(`Using the "${profile}" aws profile.\n`)
  process.stdin.setEncoding('utf8')

  try {
    const { accessKeyId, secretAccessKey, sessionToken } = await assumeRole(profile)
    process.stdout.write(`AWS_ACCESS_KEY_ID=${accessKeyId} AWS_SECRET_ACCESS_KEY=${secretAccessKey} AWS_SESSION_TOKEN=${sessionToken}`)
  } catch(e) {
    process.stderr.write(e.message + "\n")
    process.exitCode = 1
  }
}
