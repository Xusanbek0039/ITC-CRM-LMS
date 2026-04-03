import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Sahifa topilmadi</h2>
        <p className="text-gray-500 mb-6">Siz qidirayotgan sahifa mavjud emas yoki ko'chirilgan</p>
        <Link to="/">
          <Button>Bosh sahifaga qaytish</Button>
        </Link>
      </div>
    </div>
  );
}
