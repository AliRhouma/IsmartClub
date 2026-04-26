import { useNavigate } from 'react-router-dom';

const categories = [
  { name: 'Senior', slug: 'senior' },
  { name: 'Junior', slug: 'junior' },
  { name: 'U20',    slug: 'u20'    },
  { name: 'U18',    slug: 'u18'    },
  { name: 'U16',    slug: 'u16'    },
  { name: 'U14',    slug: 'u14'    },
];

export function CategoriesPage() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[1400px] mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-heading-1 text-default-font">Catégories</h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map(({ name, slug }) => (
            <div
              key={slug}
              onClick={() => navigate(`/categories/${slug}`)}
              className="bg-neutral-50 border border-neutral-200 rounded-lg p-6 cursor-pointer hover:border-brand-600 hover:shadow-md transition-all duration-200"
            >
              <span className="text-heading-3 text-default-font">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
