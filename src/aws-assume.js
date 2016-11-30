#!/usr/bin/env node

'use strict'
import 'babel-polyfill'
import { SharedIniFileCredentials, STS } from 'aws-sdk'
import { join, dirname } from 'path'
import { readFileSync } from 'fs'
import { parse } from 'ini'

function assume(profile) {
  const creds = new SharedIniFileCredentials({ profile })
  const file = process.env.AWS_CONFIG_FILE || join(dirname(creds.filename), 'config')
  const config = parse(readFileSync(file, 'utf-8'))[`profile ${profile}`]
  const sts = new STS()

  const options = {
    RoleArn: config.role_arn,
    RoleSessionName: `${profile}-${Date.now()}`
  }

  return new Promise((resolve, reject) => {
    sts.assumeRole(options, (error, response) => {
      if (error) reject(error)
      else resolve(response.Credentials)
    })
  })
}

export function getProfile() {
  if (process.argv.length > 2) {
    return process.argv[2]
  } else if (process.env.AWS_PROFILE) {
    return process.env.AWS_PROFILE
  }
  return 'default'
}

export default async (profile) => {
  process.stderr.write(`Using the "${profile}" aws profile.\n`)
  process.stdin.setEncoding('utf8')

  try {
    const { AccessKeyId, SecretAccessKey, SessionToken } = await assume(profile)
    process.stdout.write(`AWS_ACCESS_KEY_ID=${AccessKeyId} AWS_SECRET_ACCESS_KEY=${SecretAccessKey} AWS_SESSION_TOKEN=${SessionToken}`)
  } catch(e) {
    process.stderr.write(e.message + "\n")
    process.exitCode = 1
  }
}
