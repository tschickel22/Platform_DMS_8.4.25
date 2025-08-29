import type { ComponentType } from 'react'
import AccountApplicationsSection from './AccountApplicationsSection'

type SectionType = 'applications'

export interface AccountSectionDescriptor {
  id: string
  type: SectionType
  title: string
  description: string
  component: ComponentType<any>
  sort?: number
  defaultVisible?: boolean
}

const descriptor: AccountSectionDescriptor = {
  id: 'applications',
  type: 'applications',
  title: 'Finance Applications',
  description: 'Credit/loan applications for this account',
  component: AccountApplicationsSection,
  sort: 65,
  defaultVisible: true,
}

export default descriptor
