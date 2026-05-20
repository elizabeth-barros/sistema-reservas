export type User = {
  id: string;
  name: string;
  email: string;
  role: 'guest' | 'admin';
};

export type Room = {
  id: string;
  name: string;
  description: string;
  capacity: number;
  pricePerNight: number;
  isActive: boolean;
  imageUrl?: string;
};

export type Reservation = {
  id: string;
  checkIn: string;
  checkOut: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalPrice: number;
  room: Room;
  user?: User;
};

export type AvailabilityResult = {
  available: boolean;
  strategy: string;
  reason: string;
};
