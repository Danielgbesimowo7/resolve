export type Priority = 'High' | 'Medium' | 'Low'
export interface Gap { id: string; topic: string; desc: string; conversations: number; rate: number; drop: number; priority: Priority; rec: string; ago: number }
const H = 3_600_000
export const GAPS: Gap[] = [
  { id: 'g1', topic: 'Refund policy for annual plans', desc: 'Customers are unsure about refund eligibility', conversations: 184, rate: 61, drop: 8.0, priority: 'High', rec: 'Add clarification to the refund policy article regarding annual subscriptions.', ago: 2 * H },
  { id: 'g2', topic: 'Account deletion process', desc: 'Users can’t find how to delete their account', conversations: 182, rate: 68, drop: 6.2, priority: 'High', rec: 'Update account settings guide with step-by-step instructions.', ago: 5 * H },
  { id: 'g3', topic: 'Password reset errors', desc: 'Users get “invalid token” errors and cannot reset', conversations: 97, rate: 73, drop: 5.1, priority: 'Medium', rec: 'Add trouble shooting sessions for token errors', ago: 24 * H },
  { id: 'g4', topic: 'Shipping time estimates', desc: 'Confusion about delivery times', conversations: 86, rate: 76, drop: 4.7, priority: 'Medium', rec: 'Clarify delivery timeframe for different regions', ago: 26 * H },
  { id: 'g5', topic: 'Payment method issues', desc: 'Cards are not going through and errors are unclear', conversations: 73, rate: 81, drop: 3.2, priority: 'Medium', rec: 'Add common card errors to solutions and payment guide.', ago: 48 * H },
  { id: 'g6', topic: 'Feature access confusion', desc: 'Users can’t find where to enable features', conversations: 64, rate: 85, drop: 2.1, priority: 'Low', rec: 'Update onboarding flow with feature location guide.', ago: 50 * H },
  { id: 'g7', topic: 'Pricing and plan differences', desc: 'Customers ask what each plan includes', conversations: 58, rate: 89, drop: 1.8, priority: 'Low', rec: 'Add comparison table in pricing article.', ago: 72 * H },
  { id: 'g8', topic: 'Invoice and receipt requests', desc: 'Users cannot find where to download invoices', conversations: 51, rate: 66, drop: 4.4, priority: 'High', rec: 'Add a guide for finding invoices and receipts.', ago: 76 * H },
  { id: 'g9', topic: 'Team seat management', desc: 'Admins are unsure how to add or remove seats', conversations: 47, rate: 70, drop: 3.8, priority: 'High', rec: 'Document how to add and remove team seats.', ago: 96 * H },
  { id: 'g10', topic: 'Integration setup errors', desc: 'Slack and CRM connections fail during setup', conversations: 44, rate: 74, drop: 3.1, priority: 'Medium', rec: 'Add setup checklist for the Slack and CRM integrations.', ago: 98 * H },
  { id: 'g11', topic: 'Data export requests', desc: 'Customers ask about export formats and timing', conversations: 39, rate: 78, drop: 2.6, priority: 'Medium', rec: 'Explain export formats and expected wait times.', ago: 120 * H },
  { id: 'g12', topic: 'Notification settings', desc: 'Users want to control email notifications', conversations: 31, rate: 91, drop: 1.2, priority: 'Low', rec: 'Add a short guide on notification preferences.', ago: 144 * H },
]
