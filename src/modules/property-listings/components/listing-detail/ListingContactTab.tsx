import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Phone, Mail, Globe, User } from 'lucide-react'
import { Listing } from '@/types/listings'

interface ListingContactTabProps {
  listing: Listing
}

export function ListingContactTab({ listing }: ListingContactTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {listing.contactInfo.mhVillageAccountKey && (
                <div>
                  <span className="text-sm text-muted-foreground">MHVillage Account</span>
                  <div className="font-semibold">{listing.contactInfo.mhVillageAccountKey}</div>
                </div>
              )}
              
              {(listing.contactInfo.firstName || listing.contactInfo.lastName) && (
                <div>
                  <span className="text-sm text-muted-foreground">Contact Name</span>
                  <div className="font-semibold">
                    {[listing.contactInfo.firstName, listing.contactInfo.lastName].filter(Boolean).join(' ')}
                  </div>
                </div>
              )}

              {listing.contactInfo.companyName && (
                <div>
                  <span className="text-sm text-muted-foreground">Company</span>
                  <div className="font-semibold">{listing.contactInfo.companyName}</div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <div>
                  <span className="text-sm text-muted-foreground">Phone</span>
                  <div className="font-semibold">{listing.contactInfo.phone}</div>
                </div>
              </div>

              {listing.contactInfo.alternatePhone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <div>
                    <span className="text-sm text-muted-foreground">Alternate Phone</span>
                    <div className="font-semibold">{listing.contactInfo.alternatePhone}</div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <div>
                  <span className="text-sm text-muted-foreground">Email</span>
                  <div className="font-semibold">{listing.contactInfo.email}</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {listing.contactInfo.fax && (
                <div>
                  <span className="text-sm text-muted-foreground">Fax</span>
                  <div className="font-semibold">{listing.contactInfo.fax}</div>
                </div>
              )}

              {listing.contactInfo.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <div>
                    <span className="text-sm text-muted-foreground">Website</span>
                    <div className="font-semibold">
                      <a
                        href={listing.contactInfo.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {listing.contactInfo.website}
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Emails */}
              {[
                listing.contactInfo.additionalEmail1,
                listing.contactInfo.additionalEmail2,
                listing.contactInfo.additionalEmail3
              ].filter(Boolean).map((email, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <div>
                    <span className="text-sm text-muted-foreground">Additional Email {index + 1}</span>
                    <div className="font-semibold">{email}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}