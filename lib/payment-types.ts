// 결제 정보 타입
export interface PaymentInfo {
  paymentKey: string
  method: string
  totalAmount: number
  balanceAmount: number
  status: string
  requestedAt: string
  approvedAt: string
  card?: {
    company: string
    number: string
    installmentPlanMonths: number
  }
}
