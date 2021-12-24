import { ApiProperty } from '@nestjs/swagger'
import { Prop, Schema } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { Entity } from '@common/classes'
import { CustomSchema } from '@common/decorators'

export type UserDocument = User & Document

@Schema({ _id: false })
export class GoogleAuth {
  @Prop()
  access_token: string

  @Prop()
  token_type: string

  @Prop()
  id_token: string

  @Prop()
  expires_at: number

  @Prop()
  refresh_token: string

  @Prop()
  type: string
}

@Schema({ _id: false })
export class OfficeAuth {
  @Prop()
  access_token: string

  @Prop()
  token_type: string

  @Prop()
  scope: string

  @Prop()
  refresh_token: string

  @Prop()
  grant_type: string

  @Prop()
  type: string

  @Prop()
  expires_at: number
}

@Schema({ _id: false })
export class Profile {
  @Prop()
  name: string
}

@Schema({ _id: false })
class ZoomSettings {
  @Prop()
  nobot: boolean
}

@CustomSchema()
export class User extends Entity {
  @ApiProperty()
  @Prop()
  outlookId?: string

  @ApiProperty()
  @Prop()
  googleId?: string

  @ApiProperty()
  @Prop({ required: true })
  name: string

  @ApiProperty()
  @Prop({ unique: true, lowercase: true })
  email: string

  @ApiProperty()
  @Prop({ required: true })
  autoJoin: string

  @ApiProperty()
  @Prop()
  photoUrl?: string

  @ApiProperty()
  @Prop()
  freeUploadPoints?: number

  @ApiProperty({ type: [String] })
  @Prop()
  freeUploadsClaimed?: string[]

  @ApiProperty()
  @Prop()
  picture?: string

  @ApiProperty()
  @Prop()
  sendNotesTo?: string

  @ApiProperty()
  @Prop()
  privacy?: string

  @ApiProperty({ type: [String] })
  @Prop()
  joinRules?: string[]

  @ApiProperty({ type: [String] })
  @Prop()
  barRules?: string[]

  @ApiProperty()
  @Prop()
  paidUser?: string

  @ApiProperty()
  @Prop()
  dispatch?: string

  @ApiProperty()
  @Prop()
  recordingNotification?: string

  @ApiProperty()
  @Prop()
  customBotName?: string

  @ApiProperty()
  @Prop({ type: () => GoogleAuth })
  gauth?: GoogleAuth

  @ApiProperty()
  @Prop({ type: () => OfficeAuth })
  officeAuth?: OfficeAuth

  @ApiProperty()
  @Prop()
  numberNotes?: number

  @ApiProperty()
  @Prop()
  notesInjected?: number

  @ApiProperty()
  @Prop()
  numMeetingsWithNotes?: number

  @ApiProperty()
  @Prop()
  freeMeetingsLeft?: number

  @ApiProperty()
  @Prop()
  referralCode?: string

  @ApiProperty()
  @Prop()
  approvedTerms?: boolean

  @ApiProperty()
  @Prop()
  industry?: string

  @ApiProperty()
  @Prop()
  skipEmail?: boolean

  @ApiProperty()
  @Prop()
  minutesConsumed?: number

  @ApiProperty()
  @Prop()
  transcriptionMinutesConsumed?: number

  @ApiProperty()
  @Prop({ type: Date })
  cancelledAccount?: Date | null

  @ApiProperty()
  @Prop()
  isAdmin?: boolean

  @ApiProperty()
  @Prop()
  requiresLogin?: boolean

  @ApiProperty()
  @Prop()
  parseDictionaryId?: string

  @ApiProperty({ type: [String] })
  @Prop()
  dictionaries?: string[]

  @ApiProperty()
  @Prop({ type: () => Profile })
  profile?: Profile

  @ApiProperty()
  @Prop({ type: String })
  meetingTier?: string | null

  @ApiProperty()
  @Prop({ type: String })
  oldMeetingTier?: string | null

  @ApiProperty()
  @Prop({ type: Date })
  paidMeetingsUser?: Date | null

  @ApiProperty()
  @Prop()
  timezone?: string

  @ApiProperty({ type: [String] })
  @Prop()
  beforeCommands?: string[]

  @ApiProperty({ type: [String] })
  @Prop({ type: Date })
  afterCommands?: string[]

  @ApiProperty()
  @Prop({ type: String })
  autoJoinTeamEmail?: string | null

  @ApiProperty()
  @Prop({ type: ZoomSettings })
  zoom?: ZoomSettings | null

  @ApiProperty()
  @Prop({ type: String })
  stripeCustomer?: string

  @ApiProperty()
  @Prop({ type: String })
  stripePlanId?: string

  @ApiProperty()
  @Prop({ type: String })
  stripePlanNickname?: string

  @ApiProperty()
  @Prop({ type: String })
  stripeSubscriptionId?: string

  @ApiProperty({ type: [String] })
  @Prop()
  paywallsHit?: string[]

  @ApiProperty()
  @Prop({ type: Date })
  lastLogin?: Date

  @ApiProperty()
  @Prop({ type: String })
  cancelReason?: string

  @ApiProperty()
  @Prop({ type: String })
  txReferral?: string

  @ApiProperty()
  @Prop({ type: String })
  sbReferral?: string

  @ApiProperty()
  @Prop({ type: String })
  signUpSource?: string
}
