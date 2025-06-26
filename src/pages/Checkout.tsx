import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Check, 
  Upload, 
  MapPin, 
  Clock, 
  User, 
  Truck, 
  Store, 
  Building, 
  Search,
  Camera,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { motion, AnimatePresence } from 'framer-motion';

interface PickupPerson {
  id: string;
  name: string;
  type: 'self' | 'authorized' | 'budtender';
  image?: string;
  available?: boolean;
}

interface BusinessLocation {
  id: string;
  name: string;
  address: string;
  type: 'hotel' | 'restaurant' | 'cafe' | 'lounge' | 'smoke-shop' | 'gym';
  distance: number;
  acceptsDelivery: boolean;
  image: string;
}

const Checkout: React.FC = () => {
  const { items, total, clearCart } = useCartStore();
  const navigate = useNavigate();
  
  // Checkout method state
  const [checkoutMethod, setCheckoutMethod] = useState<'delivery' | 'pickup' | 'business'>('delivery');
  const [deliveryType, setDeliveryType] = useState<'standard' | 'express'>('standard');
  
  // Form data state
  const [formData, setFormData] = useState({
    // Personal info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Delivery address
    address: '',
    city: '',
    state: 'NY',
    zipCode: '',
    deliveryInstructions: '',
    
    // Pickup person
    pickupPerson: 'self',
    customPickupPerson: {
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    },
    
    // Business delivery
    businessLocation: '',
    searchBusinessTerm: '',
    
    // Payment
    paymentMethod: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    
    // Verification
    idVerified: false,
    pickupPersonIdVerified: false,
    agreeToTerms: false
  });
  
  // UI state
  const [idUploaded, setIdUploaded] = useState(false);
  const [pickupPersonIdUploaded, setPickupPersonIdUploaded] = useState(false);
  const [showExpressOptions, setShowExpressOptions] = useState(false);
  const [showBusinessSearch, setShowBusinessSearch] = useState(false);
  const [showPickupOptions, setShowPickupOptions] = useState(false);
  const [processingOrder, setProcessingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  
  // Mock data
  const [expressProducts, setExpressProducts] = useState<any[]>([]);
  const [authorizedPickupPersons, setAuthorizedPickupPersons] = useState<PickupPerson[]>([]);
  const [budtenders, setBudtenders] = useState<PickupPerson[]>([]);
  const [businessLocations, setBusinessLocations] = useState<BusinessLocation[]>([]);
  const [filteredBusinessLocations, setFilteredBusinessLocations] = useState<BusinessLocation[]>([]);
  
  useEffect(() => {
    // Simulate loading express products
    setExpressProducts([
      { id: 'exp1', name: 'Blue Dream 3.5g', price: 45.00, eta: '15-20 min', distance: 1.2 },
      { id: 'exp2', name: 'Cosmic Gummies', price: 25.00, eta: '15-20 min', distance: 1.2 },
      { id: 'exp3', name: 'Northern Lights Cart', price: 50.00, eta: '25-30 min', distance: 2.5 },
    ]);
    
    // Simulate loading authorized pickup persons
    setAuthorizedPickupPersons([
      { id: 'auth1', name: 'Sarah Johnson', type: 'authorized', image: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=100' },
      { id: 'auth2', name: 'Michael Brown', type: 'authorized', image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100' },
    ]);
    
    // Simulate loading budtenders
    setBudtenders([
      { id: 'bud1', name: 'Alex Rivera', type: 'budtender', image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100', available: true },
      { id: 'bud2', name: 'Jamie Chen', type: 'budtender', image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100', available: true },
      { id: 'bud3', name: 'Taylor Kim', type: 'budtender', image: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=100', available: false },
    ]);
    
    // Simulate loading business locations
    const mockBusinessLocations = [
      { 
        id: 'biz1', 
        name: 'JFK Airport Lounge', 
        address: 'Terminal 4, JFK Airport, Queens, NY', 
        type: 'lounge', 
        distance: 0.5, 
        acceptsDelivery: true,
        image: 'https://images.pexels.com/photos/2610756/pexels-photo-2610756.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      { 
        id: 'biz2', 
        name: 'Cloud 9 Smoke Shop', 
        address: '123 Rockaway Blvd, Queens, NY', 
        type: 'smoke-shop', 
        distance: 1.2, 
        acceptsDelivery: true,
        image: 'https://images.pexels.com/photos/3856027/pexels-photo-3856027.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      { 
        id: 'biz3', 
        name: 'Skyline Hotel', 
        address: '456 Airport Rd, Queens, NY', 
        type: 'hotel', 
        distance: 1.8, 
        acceptsDelivery: true,
        image: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      { 
        id: 'biz4', 
        name: 'The Grind Coffee Shop', 
        address: '789 Main St, Queens, NY', 
        type: 'cafe', 
        distance: 2.3, 
        acceptsDelivery: true,
        image: 'https://images.pexels.com/photos/1855214/pexels-photo-1855214.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      { 
        id: 'biz5', 
        name: 'Fitness First Gym', 
        address: '101 Health Blvd, Queens, NY', 
        type: 'gym', 
        distance: 3.1, 
        acceptsDelivery: true,
        image: 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
    ];
    
    setBusinessLocations(mockBusinessLocations);
    setFilteredBusinessLocations(mockBusinessLocations);
  }, []);
  
  useEffect(() => {
    // Filter business locations based on search term
    if (formData.searchBusinessTerm) {
      const filtered = businessLocations.filter(location => 
        location.name.toLowerCase().includes(formData.searchBusinessTerm.toLowerCase()) ||
        location.address.toLowerCase().includes(formData.searchBusinessTerm.toLowerCase()) ||
        location.type.toLowerCase().includes(formData.searchBusinessTerm.toLowerCase())
      );
      setFilteredBusinessLocations(filtered);
    } else {
      setFilteredBusinessLocations(businessLocations);
    }
  }, [formData.searchBusinessTerm, businessLocations]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.startsWith('customPickupPerson.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        customPickupPerson: {
          ...prev.customPickupPerson,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value 
      }));
    }
  };

  const handleIdUpload = (type: 'customer' | 'pickupPerson') => {
    // In a real app, this would handle the actual file upload
    if (type === 'customer') {
      setIdUploaded(true);
      setFormData(prev => ({ ...prev, idVerified: true }));
    } else {
      setPickupPersonIdUploaded(true);
      setFormData(prev => ({ ...prev, pickupPersonIdVerified: true }));
    }
  };

  const handleBusinessSelection = (businessId: string) => {
    setFormData(prev => ({ ...prev, businessLocation: businessId }));
    setShowBusinessSearch(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Process the order
    setProcessingOrder(true);
    
    // Simulate order processing
    setTimeout(() => {
      setProcessingOrder(false);
      setOrderSuccess(true);
      clearCart();
      
      // Redirect to success page after a delay
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }, 2000);
  };

  const validateForm = () => {
    // Basic validation
    if (checkoutMethod === 'delivery' && (!formData.address || !formData.zipCode)) {
      alert('Please enter your delivery address');
      return false;
    }
    
    if (checkoutMethod === 'pickup' && formData.pickupPerson === 'authorized' && !formData.pickupPersonIdVerified) {
      alert('Please upload ID for the authorized pickup person');
      return false;
    }
    
    if (checkoutMethod === 'business' && !formData.businessLocation) {
      alert('Please select a business location for delivery');
      return false;
    }
    
    if (!formData.idVerified) {
      alert('Please upload your ID for verification');
      return false;
    }
    
    if (!formData.agreeToTerms) {
      alert('Please agree to the terms and conditions');
      return false;
    }
    
    return true;
  };

  if (items.length === 0 && !orderSuccess) {
    return (
      <div className="container-custom py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="mb-6">You need to add items to your cart before checking out.</p>
        <Link to="/shop" className="btn-primary">
          Go to Shop
        </Link>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="container-custom py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Order Placed Successfully!</h2>
          <p className="mb-6">Thank you for your order. We've sent a confirmation to your email.</p>
          
          {checkoutMethod === 'delivery' && (
            <div className="bg-primary-50 p-4 rounded-lg mb-6 text-left">
              <h3 className="font-bold text-primary-800 mb-2">Delivery Information</h3>
              <p className="text-primary-700">Your order will be delivered to your address within {deliveryType === 'express' ? '30 minutes' : '60-90 minutes'}.</p>
            </div>
          )}
          
          {checkoutMethod === 'pickup' && (
            <div className="bg-primary-50 p-4 rounded-lg mb-6 text-left">
              <h3 className="font-bold text-primary-800 mb-2">Pickup Information</h3>
              <p className="text-primary-700">Your order will be ready for pickup in approximately 30 minutes.</p>
              <p className="text-primary-700 mt-2">Please bring your ID and order confirmation.</p>
            </div>
          )}
          
          {checkoutMethod === 'business' && (
            <div className="bg-primary-50 p-4 rounded-lg mb-6 text-left">
              <h3 className="font-bold text-primary-800 mb-2">Business Delivery Information</h3>
              <p className="text-primary-700">Your order will be delivered to your selected business location within 60 minutes.</p>
              <p className="text-primary-700 mt-2">Please bring your ID for verification.</p>
            </div>
          )}
          
          <Link to="/" className="btn-primary">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = total();
  const tax = subtotal * 0.13; // 13% cannabis tax in NY
  const deliveryFee = checkoutMethod === 'delivery' && deliveryType === 'standard' && subtotal < 60 ? 5 : 0;
  const expressDeliveryFee = deliveryType === 'express' ? 10 : 0;
  const finalTotal = subtotal + tax + deliveryFee + expressDeliveryFee;

  const getBusinessById = (id: string) => {
    return businessLocations.find(business => business.id === id);
  };

  const getBusinessTypeIcon = (type: string) => {
    switch (type) {
      case 'hotel':
        return <Building className="h-4 w-4" />;
      case 'restaurant':
        return <Store className="h-4 w-4" />;
      case 'cafe':
        return <Store className="h-4 w-4" />;
      case 'lounge':
        return <User className="h-4 w-4" />;
      case 'smoke-shop':
        return <Store className="h-4 w-4" />;
      case 'gym':
        return <User className="h-4 w-4" />;
      default:
        return <Building className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-neutral-50 py-8">
      <div className="container-custom">
        <div className="flex items-center mb-6">
          <Link to="/cart" className="flex items-center text-neutral-600 hover:text-primary-600">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cart
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold ml-4">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {/* Method Selection */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-lg font-bold mb-4">Delivery Method</h2>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <button
                    type="button"
                    className={`flex-1 flex items-center justify-between p-4 border rounded-lg ${
                      checkoutMethod === 'delivery' 
                        ? 'border-primary-600 bg-primary-50' 
                        : 'border-neutral-200'
                    }`}
                    onClick={() => setCheckoutMethod('delivery')}
                  >
                    <div className="flex items-center">
                      <Truck className="h-5 w-5 mr-3 text-primary-600" />
                      <div>
                        <div className="font-medium">Home Delivery</div>
                        <div className="text-sm text-neutral-500">
                          {subtotal < 60 ? 'Delivery fee $5.00' : 'Free over $60'}
                        </div>
                      </div>
                    </div>
                    {checkoutMethod === 'delivery' && (
                      <span className="flex h-6 w-6 bg-primary-600 rounded-full items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </span>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    className={`flex-1 flex items-center justify-between p-4 border rounded-lg ${
                      checkoutMethod === 'pickup' 
                        ? 'border-primary-600 bg-primary-50' 
                        : 'border-neutral-200'
                    }`}
                    onClick={() => setCheckoutMethod('pickup')}
                  >
                    <div className="flex items-center">
                      <Store className="h-5 w-5 mr-3 text-primary-600" />
                      <div>
                        <div className="font-medium">Store Pickup</div>
                        <div className="text-sm text-neutral-500">Ready in 30 minutes</div>
                      </div>
                    </div>
                    {checkoutMethod === 'pickup' && (
                      <span className="flex h-6 w-6 bg-primary-600 rounded-full items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </span>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    className={`flex-1 flex items-center justify-between p-4 border rounded-lg ${
                      checkoutMethod === 'business' 
                        ? 'border-primary-600 bg-primary-50' 
                        : 'border-neutral-200'
                    }`}
                    onClick={() => setCheckoutMethod('business')}
                  >
                    <div className="flex items-center">
                      <Building className="h-5 w-5 mr-3 text-primary-600" />
                      <div>
                        <div className="font-medium">Business Delivery</div>
                        <div className="text-sm text-neutral-500">To approved locations</div>
                      </div>
                    </div>
                    {checkoutMethod === 'business' && (
                      <span className="flex h-6 w-6 bg-primary-600 rounded-full items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </span>
                    )}
                  </button>
                </div>
                
                {/* Express Delivery Option */}
                {checkoutMethod === 'delivery' && (
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => setShowExpressOptions(!showExpressOptions)}
                      className="flex items-center justify-between w-full p-3 bg-amber-50 border border-amber-200 rounded-lg text-left"
                    >
                      <div className="flex items-center">
                        <div className="bg-amber-100 p-2 rounded-full mr-3">
                          <Truck className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <div className="font-medium text-amber-800">Express Delivery Available</div>
                          <div className="text-sm text-amber-700">Get your order in as little as 15-30 minutes</div>
                        </div>
                      </div>
                      {showExpressOptions ? (
                        <ChevronUp className="h-5 w-5 text-amber-600" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-amber-600" />
                      )}
                    </button>
                    
                    <AnimatePresence>
                      {showExpressOptions && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 border border-t-0 border-neutral-200 rounded-b-lg">
                            <div className="mb-4">
                              <div className="flex items-center mb-2">
                                <input
                                  type="radio"
                                  id="standard-delivery"
                                  name="deliveryType"
                                  value="standard"
                                  checked={deliveryType === 'standard'}
                                  onChange={() => setDeliveryType('standard')}
                                  className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                                />
                                <label htmlFor="standard-delivery" className="ml-2 block text-sm font-medium text-neutral-700">
                                  Standard Delivery (60-90 minutes)
                                </label>
                              </div>
                              <div className="flex items-center">
                                <input
                                  type="radio"
                                  id="express-delivery"
                                  name="deliveryType"
                                  value="express"
                                  checked={deliveryType === 'express'}
                                  onChange={() => setDeliveryType('express')}
                                  className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                                />
                                <label htmlFor="express-delivery" className="ml-2 block text-sm font-medium text-neutral-700">
                                  Express Delivery (15-30 minutes) +$10.00
                                </label>
                              </div>
                            </div>
                            
                            {deliveryType === 'express' && (
                              <div className="bg-neutral-50 p-3 rounded-lg">
                                <h4 className="font-medium text-sm mb-2">Express Products Near You</h4>
                                <div className="space-y-3">
                                  {expressProducts.map(product => (
                                    <div key={product.id} className="flex items-center justify-between">
                                      <div className="flex items-center">
                                        <div className="w-8 h-8 bg-neutral-200 rounded-md mr-2"></div>
                                        <div>
                                          <p className="text-sm font-medium">{product.name}</p>
                                          <p className="text-xs text-neutral-500">${product.price.toFixed(2)}</p>
                                        </div>
                                      </div>
                                      <div className="text-xs text-neutral-600">
                                        <span className="flex items-center">
                                          <Clock className="h-3 w-3 mr-1" />
                                          {product.eta}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <div className="mt-3 text-xs text-neutral-500">
                                  Express delivery is available for select products that are already in our delivery vehicles.
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-lg font-bold mb-4">Contact Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 mb-1">
                      First Name*
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 mb-1">
                      Last Name*
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                      Email Address*
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">
                      Phone Number*
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
                
                {/* ID Verification */}
                <div className="mt-6 p-4 border border-neutral-200 rounded-lg">
                  <h3 className="font-medium mb-3 flex items-center">
                    <Info className="h-4 w-4 text-primary-600 mr-2" />
                    ID Verification Required
                  </h3>
                  <p className="text-sm text-neutral-600 mb-4">
                    New York state law requires us to verify your age and identity. Please upload a photo of your government-issued ID.
                  </p>
                  
                  {!idUploaded ? (
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 rounded-lg p-6 bg-neutral-50">
                      <Camera className="h-8 w-8 text-neutral-400 mb-2" />
                      <p className="text-sm text-neutral-600 mb-4 text-center">
                        Upload a clear photo of your ID (driver's license, passport, or state ID)
                      </p>
                      <button
                        type="button"
                        onClick={() => handleIdUpload('customer')}
                        className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        Upload ID
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <Check className="h-5 w-5 text-green-600 mr-2" />
                        <span className="text-green-800 font-medium">ID successfully uploaded</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIdUploaded(false)}
                        className="text-neutral-600 hover:text-neutral-800"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                  
                  <div className="mt-4 text-xs text-neutral-500">
                    <p>Your ID will be securely stored and used only for age verification purposes in compliance with OCM regulations.</p>
                  </div>
                </div>
              </div>

              {/* Delivery/Pickup Information */}
              {checkoutMethod === 'delivery' && (
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <h2 className="text-lg font-bold mb-4">Delivery Address</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium text-neutral-700 mb-1">
                        Street Address*
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-neutral-700 mb-1">
                        City*
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-neutral-700 mb-1">
                          State*
                        </label>
                        <select
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                          className="w-full p-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="NY">New York</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="zipCode" className="block text-sm font-medium text-neutral-700 mb-1">
                          ZIP Code*
                        </label>
                        <input
                          type="text"
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          required
                          className="w-full p-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label htmlFor="deliveryInstructions" className="block text-sm font-medium text-neutral-700 mb-1">
                        Delivery Instructions
                      </label>
                      <textarea
                        id="deliveryInstructions"
                        name="deliveryInstructions"
                        rows={3}
                        value={formData.deliveryInstructions}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Apartment number, access code, or special instructions"
                      />
                    </div>
                  </div>
                </div>
              )}

              {checkoutMethod === 'pickup' && (
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <h2 className="text-lg font-bold mb-4">Pickup Information</h2>
                  
                  <div className="mb-6">
                    <div className="bg-neutral-50 p-4 rounded-lg">
                      <p className="font-medium">JFK Cannabis Dispensary</p>
                      <p>175-01 Rockaway Blvd, Queens NY 11434</p>
                      <p className="mt-2">Please bring your ID and order confirmation.</p>
                    </div>
                  </div>
                  
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowPickupOptions(!showPickupOptions)}
                      className="flex items-center justify-between w-full p-3 bg-primary-50 border border-primary-200 rounded-lg text-left"
                    >
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-primary-600 mr-3" />
                        <div>
                          <div className="font-medium text-primary-800">Who will pick up this order?</div>
                          <div className="text-sm text-primary-700">You can authorize someone else to pick up your order</div>
                        </div>
                      </div>
                      {showPickupOptions ? (
                        <ChevronUp className="h-5 w-5 text-primary-600" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-primary-600" />
                      )}
                    </button>
                    
                    <AnimatePresence>
                      {showPickupOptions && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 border border-t-0 border-neutral-200 rounded-b-lg">
                            <div className="space-y-4">
                              {/* Self Pickup */}
                              <div>
                                <div className="flex items-center mb-2">
                                  <input
                                    type="radio"
                                    id="self-pickup"
                                    name="pickupPerson"
                                    value="self"
                                    checked={formData.pickupPerson === 'self'}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                                  />
                                  <label htmlFor="self-pickup" className="ml-2 block text-sm font-medium text-neutral-700">
                                    I will pick up this order myself
                                  </label>
                                </div>
                              </div>
                              
                              {/* Authorized Person Pickup */}
                              <div>
                                <div className="flex items-center mb-2">
                                  <input
                                    type="radio"
                                    id="authorized-pickup"
                                    name="pickupPerson"
                                    value="authorized"
                                    checked={formData.pickupPerson === 'authorized'}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                                  />
                                  <label htmlFor="authorized-pickup" className="ml-2 block text-sm font-medium text-neutral-700">
                                    Authorize someone else to pick up
                                  </label>
                                </div>
                                
                                {formData.pickupPerson === 'authorized' && (
                                  <div className="ml-6 mt-3 p-4 border border-neutral-200 rounded-lg">
                                    {authorizedPickupPersons.length > 0 && (
                                      <div className="mb-4">
                                        <h4 className="text-sm font-medium mb-2">Your authorized persons:</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                          {authorizedPickupPersons.map(person => (
                                            <div 
                                              key={person.id}
                                              className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-neutral-50"
                                            >
                                              <input
                                                type="radio"
                                                id={`person-${person.id}`}
                                                name="authorizedPerson"
                                                value={person.id}
                                                className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                                              />
                                              <label htmlFor={`person-${person.id}`} className="ml-2 flex items-center cursor-pointer">
                                                <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                                                  <img 
                                                    src={person.image} 
                                                    alt={person.name} 
                                                    className="w-full h-full object-cover"
                                                  />
                                                </div>
                                                <span className="text-sm font-medium">{person.name}</span>
                                              </label>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    
                                    <div>
                                      <h4 className="text-sm font-medium mb-2">Add new authorized person:</h4>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                        <div>
                                          <label htmlFor="customPickupPerson.firstName" className="block text-xs text-neutral-700 mb-1">
                                            First Name*
                                          </label>
                                          <input
                                            type="text"
                                            id="customPickupPerson.firstName"
                                            name="customPickupPerson.firstName"
                                            value={formData.customPickupPerson.firstName}
                                            onChange={handleInputChange}
                                            className="w-full p-2 text-sm border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                                          />
                                        </div>
                                        <div>
                                          <label htmlFor="customPickupPerson.lastName" className="block text-xs text-neutral-700 mb-1">
                                            Last Name*
                                          </label>
                                          <input
                                            type="text"
                                            id="customPickupPerson.lastName"
                                            name="customPickupPerson.lastName"
                                            value={formData.customPickupPerson.lastName}
                                            onChange={handleInputChange}
                                            className="w-full p-2 text-sm border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                                          />
                                        </div>
                                        <div>
                                          <label htmlFor="customPickupPerson.email" className="block text-xs text-neutral-700 mb-1">
                                            Email*
                                          </label>
                                          <input
                                            type="email"
                                            id="customPickupPerson.email"
                                            name="customPickupPerson.email"
                                            value={formData.customPickupPerson.email}
                                            onChange={handleInputChange}
                                            className="w-full p-2 text-sm border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                                          />
                                        </div>
                                        <div>
                                          <label htmlFor="customPickupPerson.phone" className="block text-xs text-neutral-700 mb-1">
                                            Phone*
                                          </label>
                                          <input
                                            type="tel"
                                            id="customPickupPerson.phone"
                                            name="customPickupPerson.phone"
                                            value={formData.customPickupPerson.phone}
                                            onChange={handleInputChange}
                                            className="w-full p-2 text-sm border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                                          />
                                        </div>
                                      </div>
                                      
                                      {/* ID Verification for Pickup Person */}
                                      <div className="mt-3">
                                        <h4 className="text-sm font-medium mb-2">ID Verification:</h4>
                                        {!pickupPersonIdUploaded ? (
                                          <div className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 rounded-lg p-4 bg-neutral-50">
                                            <Camera className="h-6 w-6 text-neutral-400 mb-2" />
                                            <p className="text-xs text-neutral-600 mb-3 text-center">
                                              Upload a clear photo of the authorized person's ID
                                            </p>
                                            <button
                                              type="button"
                                              onClick={() => handleIdUpload('pickupPerson')}
                                              className="bg-primary-600 text-white px-3 py-1.5 text-sm rounded-lg hover:bg-primary-700 transition-colors"
                                            >
                                              Upload ID
                                            </button>
                                          </div>
                                        ) : (
                                          <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                                            <div className="flex items-center">
                                              <Check className="h-4 w-4 text-green-600 mr-2" />
                                              <span className="text-green-800 text-sm">ID successfully uploaded</span>
                                            </div>
                                            <button
                                              type="button"
                                              onClick={() => setPickupPersonIdUploaded(false)}
                                              className="text-neutral-600 hover:text-neutral-800"
                                            >
                                              <X className="h-4 w-4" />
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              {/* Budtender Pickup */}
                              <div>
                                <div className="flex items-center mb-2">
                                  <input
                                    type="radio"
                                    id="budtender-pickup"
                                    name="pickupPerson"
                                    value="budtender"
                                    checked={formData.pickupPerson === 'budtender'}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                                  />
                                  <label htmlFor="budtender-pickup" className="ml-2 block text-sm font-medium text-neutral-700">
                                    Authorize a JFK Cannabis budtender to pick up
                                  </label>
                                </div>
                                
                                {formData.pickupPerson === 'budtender' && (
                                  <div className="ml-6 mt-3 p-4 border border-neutral-200 rounded-lg">
                                    <h4 className="text-sm font-medium mb-2">Select a budtender:</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                      {budtenders.map(budtender => (
                                        <div 
                                          key={budtender.id}
                                          className={`flex items-center p-3 border rounded-lg ${
                                            !budtender.available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-neutral-50'
                                          }`}
                                        >
                                          <input
                                            type="radio"
                                            id={`budtender-${budtender.id}`}
                                            name="budtenderId"
                                            value={budtender.id}
                                            disabled={!budtender.available}
                                            className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                                          />
                                          <label 
                                            htmlFor={`budtender-${budtender.id}`} 
                                            className={`ml-2 flex items-center ${budtender.available ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                                          >
                                            <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                                              <img 
                                                src={budtender.image} 
                                                alt={budtender.name} 
                                                className="w-full h-full object-cover"
                                              />
                                            </div>
                                            <div>
                                              <span className="text-sm font-medium">{budtender.name}</span>
                                              {!budtender.available && (
                                                <span className="block text-xs text-red-600">Not available</span>
                                              )}
                                            </div>
                                          </label>
                                        </div>
                                      ))}
                                    </div>
                                    
                                    <div className="mt-4 text-xs text-neutral-500">
                                      <p>By selecting a budtender, you authorize them to pick up your order on your behalf. They will need to present their employee ID.</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {checkoutMethod === 'business' && (
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <h2 className="text-lg font-bold mb-4">Business Delivery Location</h2>
                  
                  <div className="mb-4">
                    <p className="text-neutral-600 mb-4">
                      Have your order delivered to a participating business location. Perfect for travelers, tourists, or when you're on the go.
                    </p>
                    
                    {formData.businessLocation ? (
                      <div className="bg-neutral-50 p-4 rounded-lg mb-4">
                        <div className="flex items-start">
                          <div className="w-16 h-16 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                            <img 
                              src={getBusinessById(formData.businessLocation)?.image} 
                              alt={getBusinessById(formData.businessLocation)?.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{getBusinessById(formData.businessLocation)?.name}</h3>
                            <p className="text-sm text-neutral-600">{getBusinessById(formData.businessLocation)?.address}</p>
                            <div className="flex items-center mt-1 text-xs text-neutral-500">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span>{getBusinessById(formData.businessLocation)?.distance} miles away</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, businessLocation: '' }))}
                            className="text-neutral-400 hover:text-neutral-600"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowBusinessSearch(true)}
                        className="w-full p-4 border border-dashed border-neutral-300 rounded-lg flex items-center justify-center hover:bg-neutral-50"
                      >
                        <Search className="h-5 w-5 text-neutral-400 mr-2" />
                        <span>Search for a business location</span>
                      </button>
                    )}
                    
                    {/* Business Search Modal */}
                    {showBusinessSearch && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                          <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="text-xl font-bold">Select a Business Location</h3>
                              <button
                                type="button"
                                onClick={() => setShowBusinessSearch(false)}
                                className="text-neutral-500 hover:text-neutral-700"
                              >
                                <X className="h-6 w-6" />
                              </button>
                            </div>
                            
                            <div className="mb-4">
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                                <input
                                  type="text"
                                  placeholder="Search by name, address, or type..."
                                  value={formData.searchBusinessTerm}
                                  onChange={(e) => setFormData(prev => ({ ...prev, searchBusinessTerm: e.target.value }))}
                                  className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-3 max-h-[400px] overflow-y-auto">
                              {filteredBusinessLocations.length > 0 ? (
                                filteredBusinessLocations.map(business => (
                                  <div 
                                    key={business.id}
                                    className="flex items-start p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 cursor-pointer"
                                    onClick={() => handleBusinessSelection(business.id)}
                                  >
                                    <div className="w-16 h-16 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                                      <img 
                                        src={business.image} 
                                        alt={business.name} 
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <h4 className="font-medium">{business.name}</h4>
                                      <p className="text-sm text-neutral-600">{business.address}</p>
                                      <div className="flex items-center mt-1">
                                        <span className="flex items-center text-xs text-neutral-500 mr-3">
                                          {getBusinessTypeIcon(business.type)}
                                          <span className="ml-1 capitalize">{business.type.replace('-', ' ')}</span>
                                        </span>
                                        <span className="flex items-center text-xs text-neutral-500">
                                          <MapPin className="h-3 w-3 mr-1" />
                                          <span>{business.distance} miles away</span>
                                        </span>
                                      </div>
                                    </div>
                                    {business.acceptsDelivery ? (
                                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        <Check className="h-3 w-3 mr-1" />
                                        Accepts Delivery
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                        <X className="h-3 w-3 mr-1" />
                                        No Delivery
                                      </span>
                                    )}
                                  </div>
                                ))
                              ) : (
                                <div className="text-center py-8">
                                  <MapPin className="h-8 w-8 text-neutral-400 mx-auto mb-2" />
                                  <h4 className="font-medium mb-1">No locations found</h4>
                                  <p className="text-sm text-neutral-500">Try adjusting your search terms</p>
                                </div>
                              )}
                            </div>
                            
                            <div className="mt-4 text-xs text-neutral-500">
                              <p>These businesses have partnered with JFK Cannabis to allow cannabis deliveries to their location. You must be present with valid ID to receive your order.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4 text-sm text-neutral-600">
                      <p className="flex items-start">
                        <Info className="h-4 w-4 text-primary-600 mr-2 mt-0.5" />
                        You must be present at the business location with valid ID to receive your delivery.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Information */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-lg font-bold mb-4">Payment Method</h2>
                
                <div className="mb-4">
                  <div className="flex items-center mb-4">
                    <input
                      id="payment-card"
                      name="paymentMethod"
                      type="radio"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                    />
                    <label htmlFor="payment-card" className="ml-3 block text-sm font-medium text-neutral-700">
                      Credit / Debit Card
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="payment-cash"
                      name="paymentMethod"
                      type="radio"
                      value="cash"
                      checked={formData.paymentMethod === 'cash'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                    />
                    <label htmlFor="payment-cash" className="ml-3 block text-sm font-medium text-neutral-700">
                      Cash on {checkoutMethod === 'delivery' ? 'Delivery' : 'Pickup'}
                    </label>
                  </div>
                </div>
                
                {formData.paymentMethod === 'card' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="md:col-span-2">
                      <label htmlFor="cardNumber" className="block text-sm font-medium text-neutral-700 mb-1">
                        Card Number*
                      </label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        className="w-full p-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="cardExpiry" className="block text-sm font-medium text-neutral-700 mb-1">
                        Expiry Date*
                      </label>
                      <input
                        type="text"
                        id="cardExpiry"
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        className="w-full p-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="cardCvc" className="block text-sm font-medium text-neutral-700 mb-1">
                        CVC*
                      </label>
                      <input
                        type="text"
                        id="cardCvc"
                        name="cardCvc"
                        value={formData.cardCvc}
                        onChange={handleInputChange}
                        placeholder="123"
                        className="w-full p-2 border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="age-verification"
                      name="agreeToTerms"
                      type="checkbox"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      required
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="age-verification" className="font-medium text-neutral-700">
                      Terms and Conditions
                    </label>
                    <p className="text-neutral-500">
                      I confirm that I am 21 years of age or older and that the person receiving this order will also be 21 or older with valid ID. I agree to the Terms of Service, Privacy Policy, and consent to receive marketing communications.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-6 lg:hidden">
                <button
                  type="submit"
                  disabled={processingOrder}
                  className={`w-full btn-primary py-3 text-lg flex items-center justify-center ${
                    processingOrder ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {processingOrder ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>Place Order - ${finalTotal.toFixed(2)}</>
                  )}
                </button>
              </div>
            </form>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>
              
              <div className="max-h-64 overflow-y-auto mb-4">
                {items.map(item => (
                  <div key={item.id} className="flex py-3 border-b border-neutral-100">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-neutral-200">
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-neutral-900">
                          <h3 className="line-clamp-1">{item.name}</h3>
                          <p className="ml-4">${(item.price * item.cartQuantity).toFixed(2)}</p>
                        </div>
                        <p className="mt-1 text-sm text-neutral-500">{item.weight}</p>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <p className="text-neutral-500">Qty {item.cartQuantity}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 py-4 border-t border-neutral-200">
                <div className="flex justify-between text-base">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                {checkoutMethod === 'delivery' && deliveryType === 'standard' && deliveryFee > 0 && (
                  <div className="flex justify-between text-base">
                    <span>Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                {deliveryType === 'express' && (
                  <div className="flex justify-between text-base">
                    <span>Express Delivery</span>
                    <span>${expressDeliveryFee.toFixed(2)}</span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between text-lg font-bold pt-4 border-t border-neutral-200">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
              
              <button
                type="submit"
                form="checkout-form"
                disabled={processingOrder}
                className={`mt-6 w-full btn-primary py-3 text-lg hidden lg:flex items-center justify-center ${
                  processingOrder ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {processingOrder ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>Place Order</>
                )}
              </button>
              
              <div className="mt-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Lock className="h-4 w-4 text-neutral-500 mr-1" />
                  <span className="text-xs text-neutral-500">Secure Checkout</span>
                </div>
                <p className="text-xs text-neutral-500">
                  By placing your order, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
              
              {/* Delivery/Pickup Info */}
              {checkoutMethod === 'delivery' && (
                <div className="mt-6 p-3 bg-primary-50 text-primary-800 rounded-md text-sm">
                  {deliveryType === 'express' ? (
                    <div className="flex items-start">
                      <Clock className="h-4 w-4 mt-0.5 mr-2 text-primary-600" />
                      <span>Express delivery in 15-30 minutes to your address</span>
                    </div>
                  ) : (
                    <div className="flex items-start">
                      <Truck className="h-4 w-4 mt-0.5 mr-2 text-primary-600" />
                      <span>Standard delivery in 60-90 minutes to your address</span>
                    </div>
                  )}
                </div>
              )}
              
              {checkoutMethod === 'pickup' && (
                <div className="mt-6 p-3 bg-primary-50 text-primary-800 rounded-md text-sm">
                  <div className="flex items-start">
                    <Store className="h-4 w-4 mt-0.5 mr-2 text-primary-600" />
                    <span>Pickup at JFK Cannabis, 175-01 Rockaway Blvd. Ready in approximately 30 minutes.</span>
                  </div>
                </div>
              )}
              
              {checkoutMethod === 'business' && formData.businessLocation && (
                <div className="mt-6 p-3 bg-primary-50 text-primary-800 rounded-md text-sm">
                  <div className="flex items-start">
                    <Building className="h-4 w-4 mt-0.5 mr-2 text-primary-600" />
                    <span>Delivery to {getBusinessById(formData.businessLocation)?.name}. Estimated delivery time: 60 minutes.</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;