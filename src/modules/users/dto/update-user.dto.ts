import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  MinLength
} from 'class-validator'
import { IsTimeZoneValid } from '@common/decorators'
import { GoogleAuth, OfficeAuth, Profile } from '../models'

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  name?: string

  @IsString()
  @IsOptional()
  @IsUrl()
  photoUrl?: string

  @IsString()
  @IsOptional()
  @IsTimeZoneValid('timezone', { message: 'invalid timezone' })
  timezone?: string

  // Adding all user fields below to update fully
  @IsString()
  @IsOptional()
  outlookId?: string

  @IsString()
  @IsOptional()
  autoJoin?: string

  @IsNumber()
  @IsOptional()
  freeUploadPoints?: number

  @IsArray()
  @IsOptional()
  freeUploadsClaimed?: string[]

  @IsString()
  @IsOptional()
  picture?: string

  @IsString()
  @IsOptional()
  sendNotesTo?: string

  @IsString()
  @IsOptional()
  privacy?: string

  @IsArray()
  @IsOptional()
  joinRules?: string[]

  @IsArray()
  @IsOptional()
  barRules?: string[]

  @IsString()
  @IsOptional()
  paidUser?: string

  @IsString()
  @IsOptional()
  dispatch?: string

  @IsString()
  @IsOptional()
  recordingNotification?: string

  @IsString()
  @IsOptional()
  customBotName?: string

  @IsObject()
  @IsOptional()
  gauth?: GoogleAuth

  @IsObject()
  @IsOptional()
  officeAuth?: OfficeAuth

  @IsNumber()
  @IsOptional()
  numberNotes?: number

  @IsNumber()
  @IsOptional()
  notesInjected?: number

  @IsNumber()
  @IsOptional()
  numMeetingsWithNotes?: number

  @IsNumber()
  @IsOptional()
  freeMeetingsLeft?: number

  @IsString()
  @IsOptional()
  referralCode?: string

  @IsBoolean()
  @IsOptional()
  approvedTerms?: boolean

  @IsString()
  @IsOptional()
  industry?: string

  @IsBoolean()
  @IsOptional()
  skipEmail?: boolean

  @IsNumber()
  @IsOptional()
  minutesConsumed?: number

  @IsNumber()
  @IsOptional()
  transcriptionMinutesConsumed?: number

  @IsDate()
  @IsOptional()
  cancelledAccount?: Date

  @IsBoolean()
  @IsOptional()
  isAdmin?: boolean

  @IsString()
  @IsOptional()
  parseDictionaryId?: string

  @IsArray()
  @IsOptional()
  dictionaries?: string[]

  @IsObject()
  @IsOptional()
  profile?: Profile

  @IsString()
  @IsOptional()
  meetingTier?: string

  @IsString()
  @IsOptional()
  oldMeetingTier?: string

  @IsDate()
  @IsOptional()
  paidMeetingsUser?: Date

  @IsString()
  @IsOptional()
  stripeCustomer?: string

  @IsString()
  @IsOptional()
  stripePlanId?: string

  @IsString()
  @IsOptional()
  stripePlanNickname?: string

  @IsString()
  @IsOptional()
  stripeSubscriptionId?: string

  @IsArray()
  @IsOptional()
  paywallsHit?: string[]

  @IsDate()
  @IsOptional()
  lastLogin?: Date

  @IsString()
  @IsOptional()
  cancelReason?: string

  @IsString()
  @IsOptional()
  txReferral?: string

  @IsString()
  @IsOptional()
  sbReferral?: string

  @IsString()
  @IsOptional()
  signUpSource?: string
}
