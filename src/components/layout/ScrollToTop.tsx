import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  // استخدام useLocation لمراقبة أي تغيير في رابط الصفحة (URL)
  const { pathname } = useLocation();

  useEffect(() => {
    // عند تغيير المسار، يتم نقل نافذة المتصفح إلى الإحداثيات (0, 0)
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // نستخدم instant لضمان الانتقال السريع قبل ظهور محتوى الصفحة الجديدة
    });
  }, [pathname]);

  // هذا المكون لا يظهر شيئاً في واجهة المستخدم، هو فقط منطق برمجي
  return null;
};

export default ScrollToTop;
