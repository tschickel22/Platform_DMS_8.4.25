import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, CreditCard, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';
import { mockFinanceData } from '@/mocks/financeMock';
import { useSettings } from '@/modules/platform-admin/settings/utils/useSettings';
import { useToast } from '@/hooks/use-toast';

interface CheckoutAccount {
  id: string;
  customerName: string;
  accountNumber: string;
  balance: number;
  status: 'active' | 'inactive' | 'delinquent';
  loanAmount?: number;
  monthlyPayment?: number;
  nextDueDate?: string;
  invoiceNumber?: string;
  invoiceAmount?: number;
}

interface PaymentProcessorConfig {
  processor: 'stripe' | 'paypal' | 'square' | 'none';
  stripePublishableKey?: string;
  paypalClientId?: string;
  squareApplicationId?: string;
}

export function CheckoutTerminal() {
  const [paymentType, setPaymentType] = useState<'loan' | 'invoice'>('loan');
  const [searchTerm, setSearchTerm] = useState('');
  const [foundAccount, setFoundAccount] = useState<CheckoutAccount | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { settings, loading: settingsLoading } = useSettings();
  const { toast } = useToast();
  const [paymentConfig, setPaymentConfig] = useState<PaymentProcessorConfig | null>(null);

  // Clear account when payment type changes
  useEffect(() => {
    setFoundAccount(null);
    setSearchTerm('');
    setLookupError(null);
  }, [paymentType]);

  // Load payment processor configuration from settings
  useEffect(() => {
    if (settings?.payment) {
      setPaymentConfig({
        processor: settings.payment.processor || 'none',
        stripePublishableKey: settings.payment.stripePublishableKey,
        paypalClientId: settings.payment.paypalClientId,
        squareApplicationId: settings.payment.squareApplicationId,
      });
    } else {
      setPaymentConfig({ processor: 'none' });
    }
  }, [settings]);

  const handleAccountLookup = async () => {
    if (!searchTerm.trim()) {
      setLookupError('Please enter a search term');
      return;
    }

    setIsLookingUp(true);
    setLookupError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Search in mock data
      const account = mockFinanceData.find(acc => 
        acc.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        acc.accountNumber.includes(searchTerm) ||
        (paymentType === 'invoice' && acc.invoiceNumber?.includes(searchTerm))
      );

      if (account) {
        setFoundAccount(account);
        // Auto-populate payment amount based on type
        if (paymentType === 'loan' && account.monthlyPayment) {
          setPaymentAmount(account.monthlyPayment.toString());
        } else if (paymentType === 'invoice' && account.invoiceAmount) {
          setPaymentAmount(account.invoiceAmount.toString());
        }
      } else {
        setLookupError(`No ${paymentType} account found for "${searchTerm}"`);
        setFoundAccount(null);
      }
    } catch (error) {
      setLookupError('Failed to lookup account. Please try again.');
    } finally {
      setIsLookingUp(false);
    }
  };

  const handleQuickAmount = (amount: number) => {
    setPaymentAmount(amount.toString());
  };

  const processStripePayment = async (amount: number) => {
    if (!paymentConfig?.stripePublishableKey) {
      throw new Error('Stripe configuration missing. Please configure Stripe in platform settings.');
    }
    
    // Placeholder for Stripe integration
    // In a real implementation, you would:
    // 1. Load Stripe.js with the publishable key
    // 2. Create payment intent on your backend
    // 3. Confirm payment with Stripe Elements
    
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
    return { success: true, transactionId: `stripe_${Date.now()}` };
  };

  const processPayPalPayment = async (amount: number) => {
    if (!paymentConfig?.paypalClientId) {
      throw new Error('PayPal configuration missing. Please configure PayPal in platform settings.');
    }
    
    // Placeholder for PayPal integration
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
    return { success: true, transactionId: `paypal_${Date.now()}` };
  };

  const processSquarePayment = async (amount: number) => {
    if (!paymentConfig?.squareApplicationId) {
      throw new Error('Square configuration missing. Please configure Square in platform settings.');
    }
    
    // Placeholder for Square integration
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
    return { success: true, transactionId: `square_${Date.now()}` };
  };

  const processPayment = async (amount: number) => {
    if (!paymentConfig) {
      throw new Error('Payment configuration not loaded');
    }

    switch (paymentConfig.processor) {
      case 'stripe':
        return await processStripePayment(amount);
      case 'paypal':
        return await processPayPalPayment(amount);
      case 'square':
        return await processSquarePayment(amount);
      case 'none':
        throw new Error('No payment processor configured. Please configure a payment processor in platform settings.');
      default:
        throw new Error(`Unsupported payment processor: ${paymentConfig.processor}`);
    }
  };

  const handlePayment = async () => {
    if (!foundAccount || !paymentAmount) return;

    const amount = parseFloat(paymentAmount);
    setIsProcessing(true);

    try {
      const result = await processPayment(amount);
      
      if (result.success) {
        toast({
          title: "Payment Successful",
          description: `Payment of $${amount} processed successfully for ${foundAccount.customerName}. Transaction ID: ${result.transactionId}`,
        });
        
        // Reset form after successful payment
        setFoundAccount(null);
        setPaymentAmount('');
        setSearchTerm('');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed. Please try again.';
      toast({
        title: "Payment Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const canProcessPayment = foundAccount && paymentAmount && parseFloat(paymentAmount) > 0;

  // Show loading state while settings are loading
  if (settingsLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center">Loading payment configuration...</CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>Payment Terminal</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Payment Processor Status */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4" />
              <span className="text-sm font-medium">Payment Processor:</span>
            </div>
            <Badge variant={paymentConfig?.processor === 'none' ? 'destructive' : 'default'}>
              {paymentConfig?.processor === 'none' 
                ? 'Not Configured' 
                : paymentConfig?.processor?.toUpperCase() || 'Loading...'
              }
            </Badge>
          </div>

          {/* Payment Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="payment-type">Payment Type</Label>
            <Select value={paymentType} onValueChange={(value: 'loan' | 'invoice') => setPaymentType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="loan">Loan Payment</SelectItem>
                <SelectItem value="invoice">Invoice Payment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Account Lookup */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search">
                Search by {paymentType === 'loan' ? 'Customer Name or Account Number' : 'Customer Name or Invoice Number'}
              </Label>
              <div className="flex space-x-2">
                <Input
                  id="search"
                  placeholder={paymentType === 'loan' ? 'Enter name or account number...' : 'Enter name or invoice number...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAccountLookup()}
                />
                <Button 
                  onClick={handleAccountLookup}
                  disabled={isLookingUp || !searchTerm.trim()}
                >
                  {isLookingUp ? 'Searching...' : 'Search'}
                </Button>
              </div>
            </div>

            {lookupError && (
              <div className="flex items-center space-x-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{lookupError}</span>
              </div>
            )}
          </div>

          {/* Account Details */}
          {foundAccount && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800">Account Found</span>
                  </div>
                  <Badge 
                    variant={foundAccount.status === 'active' ? 'default' : 'destructive'}
                  >
                    {foundAccount.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Customer:</span>
                    <p className="font-medium">{foundAccount.customerName}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Account:</span>
                    <p className="font-medium">{foundAccount.accountNumber}</p>
                  </div>
                  
                  {paymentType === 'loan' && (
                    <>
                      <div>
                        <span className="text-gray-600">Loan Balance:</span>
                        <p className="font-medium">${foundAccount.loanAmount?.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Monthly Payment:</span>
                        <p className="font-medium">${foundAccount.monthlyPayment?.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Next Due:</span>
                        <p className="font-medium">{foundAccount.nextDueDate}</p>
                      </div>
                    </>
                  )}
                  
                  {paymentType === 'invoice' && (
                    <>
                      <div>
                        <span className="text-gray-600">Invoice #:</span>
                        <p className="font-medium">{foundAccount.invoiceNumber}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Amount Due:</span>
                        <p className="font-medium">${foundAccount.invoiceAmount?.toLocaleString()}</p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Amount */}
          {foundAccount && (
            <div className="space-y-4">
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="amount">Payment Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Quick Amount Buttons */}
              <div className="flex space-x-2">
                {paymentType === 'loan' && foundAccount.monthlyPayment && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAmount(foundAccount.monthlyPayment!)}
                  >
                    Monthly Payment (${foundAccount.monthlyPayment})
                  </Button>
                )}
                {paymentType === 'invoice' && foundAccount.invoiceAmount && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAmount(foundAccount.invoiceAmount!)}
                  >
                    Full Amount (${foundAccount.invoiceAmount})
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Process Payment Button */}
          {foundAccount && (
   <>
  <Button
    onClick={handlePayment}
    className="w-full"
    disabled={
      !canProcessPayment ||
      isProcessing ||
      paymentConfig?.processor === 'none'
    }
    size="lg"
  >
    {isProcessing ? (
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        <span>Processing...</span>
      </div>
    ) : (
      `Process Payment - $${paymentAmount}`
    )}
  </Button>

  {paymentConfig?.processor === 'none' && (
    <p className="text-sm text-red-600 text-center mt-2">
      Payment processing is disabled. Please configure a payment processor in platform settings.
    </p>
  )}
</>
            )}
        </CardContent>
      </Card>
    </div>
  );
}