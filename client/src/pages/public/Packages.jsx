import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import { getPackages } from '../../services/api';
import PackageCard from '../../components/common/PackageCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useLanguage } from '../../context/LanguageContext';

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [durationFilter, setDurationFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const data = await getPackages();
        setPackages(data);
        setFilteredPackages(data);
      } catch (error) {
        console.error('Error fetching packages:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  useEffect(() => {
    let result = packages;

    if (searchTerm) {
      result = result.filter(
        (pkg) =>
          pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (priceFilter !== 'all') {
      switch (priceFilter) {
        case 'low':
          result = result.filter((pkg) => pkg.price < 50);
          break;
        case 'medium':
          result = result.filter((pkg) => pkg.price >= 50 && pkg.price < 100);
          break;
        case 'high':
          result = result.filter((pkg) => pkg.price >= 100);
          break;
      }
    }

    if (durationFilter !== 'all') {
      switch (durationFilter) {
        case 'short':
          result = result.filter((pkg) => pkg.duration_days && pkg.duration_days <= 14);
          break;
        case 'medium':
          result = result.filter(
            (pkg) => pkg.duration_days && pkg.duration_days > 14 && pkg.duration_days <= 30
          );
          break;
        case 'long':
          result = result.filter((pkg) => pkg.duration_days && pkg.duration_days > 30);
          break;
      }
    }

    setFilteredPackages(result);
  }, [searchTerm, priceFilter, durationFilter, packages]);

  const clearFilters = () => {
    setSearchTerm('');
    setPriceFilter('all');
    setDurationFilter('all');
  };

  const hasActiveFilters = searchTerm || priceFilter !== 'all' || durationFilter !== 'all';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-6 md:py-8">
        {/* Title */}
        <div className="mb-6">
          <span className="text-primary font-medium text-sm">Salute e Fede</span>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mt-1">
            {t('packages.title')}
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            {t('packages.subtitle')}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={t('packages.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-12"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden btn btn-secondary"
            >
              <Filter size={20} />
              {t('packages.filters')}
            </button>
          </div>

          <div className={`flex flex-col md:flex-row gap-4 ${showFilters ? 'block' : 'hidden md:flex'}`}>
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="input md:w-48"
            >
              <option value="all">{t('packages.allPrices')}</option>
              <option value="low">{t('packages.upTo50')}</option>
              <option value="medium">{t('packages.from50to100')}</option>
              <option value="high">{t('packages.over100')}</option>
            </select>

            <select
              value={durationFilter}
              onChange={(e) => setDurationFilter(e.target.value)}
              className="input md:w-48"
            >
              <option value="all">{t('packages.allDurations')}</option>
              <option value="short">{t('packages.upTo14days')}</option>
              <option value="medium">{t('packages.from15to30days')}</option>
              <option value="long">{t('packages.over30days')}</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="btn bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                <X size={18} />
                {t('packages.clearFilters')}
              </button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <p className="text-gray-600 mb-6">
          {filteredPackages.length} {filteredPackages.length === 1 ? t('packages.packageFound') : t('packages.packagesFound')}
        </p>

        {/* Packages Grid */}
        {loading ? (
          <LoadingSpinner size="lg" className="py-12" />
        ) : filteredPackages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              {t('packages.noPackages')}
            </p>
            <button onClick={clearFilters} className="btn btn-primary">
              {t('packages.clearFilters')}
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPackages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} featured={pkg.is_featured} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Packages;
