import React, { useEffect, useState, useCallback } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {
  User,
  Package,
  Heart,
  Star,
  LogOut,
  RefreshCw,
  Mail,
  Settings,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";

interface UserProfileData {
  displayName: string;
  points: number;
  orders: any[];
  wishlist: any[];
  email?: string;
  phoneNumber?: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [userData, setUserData] = useState<UserProfileData | null>(null);

  // --- 1. مزامنة البيانات من Firestore ---
  const fetchAndSyncUserData = useCallback(async (uid: string) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUserData(userSnap.data() as UserProfileData);
      } else {
        const newData: UserProfileData = {
          displayName: auth.currentUser?.displayName || "Happy Shopper",
          points: 100,
          orders: [],
          wishlist: [],
          email: auth.currentUser?.email || "",
          phoneNumber: auth.currentUser?.phoneNumber || "",
        };
        await setDoc(userRef, {
          ...newData,
          uid,
          createdAt: serverTimestamp(),
        });
        setUserData(newData);
      }
    } catch (err) {
      toast.error("Sync failed. Check connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  // --- 2. دالة إضافة بيانات تجريبية (محسنة) ---
  const handleAddTestData = async () => {
    if (!auth.currentUser) return;
    setSyncing(true);
    const userRef = doc(db, "users", auth.currentUser.uid);

    try {
      await updateDoc(userRef, {
        points: increment(50),
        wishlist: arrayUnion(`Item_${Math.floor(Math.random() * 1000)}`),
      });

      // إعادة جلب البيانات لضمان المزامنة بنسبة 100% مع السحاب
      await fetchAndSyncUserData(auth.currentUser.uid);
      toast.success("Wallet & Wishlist Updated!");
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) fetchAndSyncUserData(user.uid);
      else navigate("/login");
    });
    return () => unsubscribe();
  }, [navigate, fetchAndSyncUserData]);

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white ">
        <div className="relative">
          <RefreshCw className="animate-spin text-brand-gold mb-4" size={50} />
          <div className="absolute inset-0 blur-2xl bg-brand-gold/20 animate-pulse"></div>
        </div>
        <p className="font-serif tracking-widest text-brand-deep">
          GETTING YOUR PROFILE...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-brand-soft-white/20 py-16 px-6 mt-20 font-sans">
      <div className="max-w-2xl mx-auto">
        {/* Profile Header Card */}
        <div className="bg-brand-deep rounded-[3.5rem] p-10 relative overflow-hidden shadow-2xl mb-8">
          {/* Decoration */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="group relative">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center border-4 border-brand-gold shadow-2xl transition-transform group-hover:scale-105">
                <span className="text-5xl font-serif text-brand-gold uppercase">
                  {userData?.displayName?.charAt(0) || <User size={40} />}
                </span>
              </div>
              <button className="absolute bottom-1 right-1 bg-brand-gold text-white p-2 rounded-full shadow-lg border-2 border-brand-deep hover:bg-white hover:text-brand-gold transition-colors">
                <Settings size={16} />
              </button>
            </div>

            <h2 className="text-4xl font-serif text-white mt-6 mb-1 capitalize">
              {userData?.displayName}
            </h2>
            <p className="text-brand-gold/80 text-sm tracking-widest mb-8 flex items-center gap-2">
              <Mail size={14} /> {userData?.email}
            </p>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 w-full rounded-[2.5rem] p-6 flex items-center justify-between shadow-inner">
              <div className="flex items-center gap-4">
                <div className="bg-brand-gold p-3 rounded-2xl shadow-lg">
                  <Star size={24} className="text-white fill-white" />
                </div>
                <div>
                  <p className="text-[10px] uppercase text-white/50 tracking-tighter">
                    Premium Points
                  </p>
                  <p className="text-2xl font-bold text-white leading-none">
                    {userData?.points.toLocaleString()}
                  </p>
                </div>
              </div>
              <button
                onClick={handleAddTestData}
                disabled={syncing}
                className="bg-brand-gold/20 hover:bg-brand-gold text-brand-gold hover:text-white px-5 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
              >
                {syncing ? "SYNCING..." : "EARN POINTS"}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-6 rounded-[2.5rem] border border-brand-gold/10 flex items-center gap-4 hover:shadow-xl transition-all cursor-pointer group">
            <div className="bg-brand-soft-white p-4 rounded-2xl group-hover:bg-brand-dark-green/10 transition-colors">
              <Package className="text-brand-dark-green" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-deep">
                {userData?.orders?.length || 0}
              </p>
              <p className="text-[10px] text-brand-gray uppercase font-bold">
                Orders
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] border border-brand-gold/10 flex items-center gap-4 hover:shadow-xl transition-all cursor-pointer group">
            <div className="bg-red-50 p-4 rounded-2xl group-hover:bg-red-100 transition-colors">
              <Heart className="text-red-500 fill-red-500" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-deep">
                {userData?.wishlist?.length || 0}
              </p>
              <p className="text-[10px] text-brand-gray uppercase font-bold">
                Favorites
              </p>
            </div>
          </div>
        </div>

        {/* Action Menu */}
        <div className="space-y-3">
          {[
            {
              label: "My Orders History",
              icon: <Package size={18} />,
              action: () => navigate("/orders"),
            },
            {
              label: "Wishlist Details",
              icon: <Heart size={18} />,
              action: () => navigate("/wishlist"),
            },
            {
              label: "Account Settings",
              icon: <Settings size={18} />,
              action: () => {},
            },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={item.action}
              className="w-full bg-white p-5 rounded-3xl flex items-center justify-between group hover:bg-brand-gold/5 transition-all border border-transparent hover:border-brand-gold/20"
            >
              <div className="flex items-center gap-4 text-brand-deep font-medium">
                <span className="text-brand-gold">{item.icon}</span>
                {item.label}
              </div>
              <ChevronRight
                size={18}
                className="text-brand-gray group-hover:translate-x-1 transition-transform"
              />
            </button>
          ))}

          <button
            onClick={() => auth.signOut()}
            className="w-full mt-6 py-5 rounded-[2.5rem] bg-red-50 text-red-500 font-bold text-xs tracking-widest flex items-center justify-center gap-3 hover:bg-red-500 hover:text-white transition-all shadow-sm"
          >
            <LogOut size={18} /> LOGOUT FROM ACCOUNT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
