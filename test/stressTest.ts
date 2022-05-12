/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable no-console */
// @ts-nocheck

import grpc from 'k6/net/grpc'
import { check, sleep } from 'k6'
import crypto from 'k6/crypto'
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js'

export function handleSummary(data) {
  return {
    'summary.html': htmlReport(data)
  }
}

// stress test on vus per 60 s
const duration = '60s'
const target = 7700
export const options = {
  thresholds: {
    metric_name: [
      {
        threshold: 'p(99) < 10', // string
        abortOnFail: true, // boolean
        delayAbortEval: '10s' // string
      }
    ]
  },
  stages: [{ duration, target }]
}

const client = new grpc.Client()
client.load(['../src/modules/grpc/user/proto'], 'user.proto')

export default () => {
  const timeStamp = Date.now()

  const fakeSignature = (clientId, body) => {
    const hmac = crypto.createHMAC('sha256', 'secret')
    hmac.update(`v0:${timeStamp}:${JSON.stringify(body)}`)
    return `c${clientId}=${hmac.digest('hex')}`
  }

  const params = {
    headers: {
      'x-fireflies-service': 'test-ff',
      'x-fireflies-signature': `${fakeSignature('123454', { id: 'WBbLghcYfL' })}`,
      'x-fireflies-request-timestamp': `${timeStamp}`
    }
  }

  const paramsForUpdateUser = {
    headers: {
      'x-fireflies-service': 'test-ff',
      'x-fireflies-signature': `${fakeSignature('123454', {
        id: 'WBbLghcYfL',
        data: { name: 'HamzaHamzaHamza' }
      })}`,
      'x-fireflies-request-timestamp': `${timeStamp}`
    }
  }

  const paramsForGetAllUsers = {
    headers: {
      'x-fireflies-service': 'test-ff',
      'x-fireflies-signature': `${fakeSignature('123454', {
        select: ['name', 'email'],
        page: 1,
        pageSize: 10,
        sort: 'id',
        order: '1'
      })}`,
      'x-fireflies-request-timestamp': `${timeStamp}`
    }
  }

  client.connect('user-service.fireflies.dev:443')

  const getAllUsersData = {
    select: ['name', 'email'],
    page: 1,
    pageSize: 10,
    sort: 'id',
    order: '1'
  }
  const getAllUsersResponse = client.invoke(
    'user.UserGrpcService/GetAllUsers',
    getAllUsersData,
    paramsForGetAllUsers
  )

  check(getAllUsersResponse, {
    'Status Check ==> GetAllUsers': r => r && r.status === grpc.StatusOK,
    'Data ===> GetAllUsersData': r => r && r.message.count === getAllUsersResponse.message.count
  })

  const userId = 'WBbLghcYfL'
  const getUserByIdData = { id: userId }
  const getUserByIdResponse = client.invoke(
    'user.UserGrpcService/GetUserById',
    getUserByIdData,
    params
  )

  check(getUserByIdResponse, {
    'Status Check ==> getUserById': r => r && r.status === grpc.StatusOK
  })

  const updateUserData = { id: userId, data: { name: 'HamzaHamzaHamza' } }
  const updateUserResponse = client.invoke(
    'user.UserGrpcService/UpdateUser',
    updateUserData,
    paramsForUpdateUser
  )

  check(updateUserResponse, {
    'Status Check ==> UpdateUser': r => r && r.status === grpc.StatusOK,
    'Data ==> UpdateUser': r => r && r.message.data.id === updateUserData.id
  })

  const deactivateUserData = { id: userId }
  const deactivateUserResponse = client.invoke(
    'user.UserGrpcService/DeactivateUser',
    deactivateUserData,
    params
  )

  check(deactivateUserResponse, {
    'Status Check ==> DeactivateUser': r => r && r.status === grpc.StatusOK,
    'Data ==> DeactiveUser': r => r && r.message.data === true
  })

  const reactivateUserData = { id: userId }
  const reactivateUserResponse = client.invoke(
    'user.UserGrpcService/ReactivateUser',
    reactivateUserData,
    params
  )

  check(reactivateUserResponse, {
    'Status Check ==> ReactivateUser': r => r && r.status === grpc.StatusOK,
    'Data ==> ReactiveUser': r => r && r.message.data.id === reactivateUserData.id
  })

  client.close()
  sleep(1)
}
