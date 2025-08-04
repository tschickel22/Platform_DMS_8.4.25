import { useState, useEffect } from 'react';
import { 
  mockWarrantyClaims, 
  mockReimbursementRequests, 
  mockManufacturers,
  mockServiceItems 
} from '../../../mocks/warrantyMock';
import type { 
  WarrantyClaim, 
  ReimbursementRequest, 
  Manufacturer,
  ServiceItem 
} from '../types';

export const useWarrantyManagement = () => {
  const [claims, setClaims] = useState<WarrantyClaim[]>([]);
  const [reimbursementRequests, setReimbursementRequests] = useState<ReimbursementRequest[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const loadData = async () => {
      try {
        setLoading(true);
        // In a real app, these would be API calls
        setClaims(mockWarrantyClaims);
        setReimbursementRequests(mockReimbursementRequests);
        setManufacturers(mockManufacturers);
        setServiceItems(mockServiceItems);
      } catch (error) {
        console.error('Error loading warranty data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const createClaim = async (claimData: Omit<WarrantyClaim, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newClaim: WarrantyClaim = {
      ...claimData,
      id: `claim-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setClaims(prev => [...prev, newClaim]);
    return newClaim;
  };

  const updateClaim = async (id: string, updates: Partial<WarrantyClaim>) => {
    setClaims(prev => prev.map(claim => 
      claim.id === id 
        ? { ...claim, ...updates, updatedAt: new Date().toISOString() }
        : claim
    ));
  };

  const deleteClaim = async (id: string) => {
    setClaims(prev => prev.filter(claim => claim.id !== id));
  };

  const createReimbursementRequest = async (requestData: Omit<ReimbursementRequest, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRequest: ReimbursementRequest = {
      ...requestData,
      id: `reimb-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setReimbursementRequests(prev => [...prev, newRequest]);
    return newRequest;
  };

  const updateReimbursementRequest = async (id: string, updates: Partial<ReimbursementRequest>) => {
    setReimbursementRequests(prev => prev.map(request => 
      request.id === id 
        ? { ...request, ...updates, updatedAt: new Date().toISOString() }
        : request
    ));
  };

  return {
    claims,
    reimbursementRequests,
    manufacturers,
    serviceItems,
    loading,
    createClaim,
    updateClaim,
    deleteClaim,
    createReimbursementRequest,
    updateReimbursementRequest
  };
};