import { notFound } from 'next/navigation';
import Link from 'next/link';
import Layout from '../../../../components/Layout';
import { getCourseBySlug, getTechnologyBySlug } from '../../../../lib/data';

interface CoursePageProps {
  params: Promise<{
    technology: string;
    'course-slug': string;
  }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { technology, 'course-slug': courseSlug } = await params;
  const course = getCourseBySlug(courseSlug);
  const technologyData = getTechnologyBySlug(technology);

  if (!course || !technologyData || course.technology !== technology) {
    notFound();
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Advanced':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriceDisplay = (price?: 'free' | 'paid') => {
    return price === 'free' ? 'FREE' : 'PAID';
  };

  const getPriceColor = (price?: 'free' | 'paid') => {
    return price === 'free' ? 'text-green-600' : 'text-blue-600';
  };

  return (
    <Layout>
      {/* Breadcrumb */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-blue-600">
              <i className="fas fa-home mr-1"></i>
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href={`/${technology}`} className="text-gray-500 hover:text-blue-600">
              {technologyData.name}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{course.title}</span>
          </nav>
        </div>
      </section>

      {/* Course Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Course Image */}
            <div className="lg:w-1/3">
              <div className="bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={course.image || '/placeholder-course.jpg'}
                  alt={course.title}
                  className="w-full h-64 object-cover"
                />
              </div>
            </div>

            {/* Course Info */}
            <div className="lg:w-2/3">
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getLevelColor(course.level)}`}>
                  {course.level}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriceColor(course.price)}`}>
                  {getPriceDisplay(course.price)}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
              <p className="text-gray-600 text-lg mb-6">{course.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{course.duration}</div>
                  <div className="text-sm text-gray-500">Duration</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{course.lessons || course.topics}</div>
                  <div className="text-sm text-gray-500">Lessons</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{course.students || course.studentsCount || 0}</div>
                  <div className="text-sm text-gray-500">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{course.rating || 0}</div>
                  <div className="text-sm text-gray-500">Rating</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {course.tags?.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>

              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                Start Learning
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* What You'll Learn */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">What You'll Learn</h2>
                {course.learningObjectives ? (
                  <ul className="space-y-3">
                    {course.learningObjectives.map((objective, index) => (
                      <li key={index} className="flex items-start">
                        <i className="fas fa-check text-green-500 mt-1 mr-3"></i>
                        <span className="text-gray-700">{objective}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">Learning objectives will be available soon.</p>
                )}
              </div>

              {/* Course Content */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Content</h2>
                <div className="space-y-4">
                  {/* Mock course content since we don't have detailed topics */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <i className="fas fa-play-circle text-blue-500 mr-3"></i>
                        <div>
                          <h3 className="font-medium text-gray-900">Introduction to {course.title}</h3>
                          <p className="text-sm text-gray-600">Course overview and prerequisites</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">15 min</div>
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <i className="fas fa-play-circle text-blue-500 mr-3"></i>
                        <div>
                          <h3 className="font-medium text-gray-900">Core Concepts</h3>
                          <p className="text-sm text-gray-600">Fundamental concepts and theory</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">45 min</div>
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <i className="fas fa-play-circle text-blue-500 mr-3"></i>
                        <div>
                          <h3 className="font-medium text-gray-900">Practical Examples</h3>
                          <p className="text-sm text-gray-600">Hands-on coding examples</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">1h 30min</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prerequisites */}
              {course.prerequisites && course.prerequisites.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Prerequisites</h2>
                  <ul className="space-y-2">
                    {course.prerequisites.map((prereq, index) => (
                      <li key={index} className="flex items-start">
                        <i className="fas fa-info-circle text-blue-500 mt-1 mr-3"></i>
                        <span className="text-gray-700">{prereq}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Course Instructor</h3>
                {typeof course.instructor === 'object' ? (
                  <>
                    <div className="flex items-center mb-4">
                      <img
                        src={course.instructor.avatar || '/placeholder-avatar.jpg'}
                        alt={course.instructor.name}
                        className="w-12 h-12 rounded-full mr-3"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{course.instructor.name}</div>
                        <div className="text-sm text-gray-600">{course.instructor.title}</div>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm mb-4">{course.instructor.bio}</p>

                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Rating</span>
                        <div className="flex items-center">
                          <i className="fas fa-star text-yellow-400 mr-1"></i>
                          <span className="font-medium">{course.instructor.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-2">
                        <span className="text-gray-600">Students</span>
                        <span className="font-medium">{course.instructor.students}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-2">
                        <span className="text-gray-600">Courses</span>
                        <span className="font-medium">{course.instructor.courses}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-gray-700">{course.instructor || 'TechToTalk Academy'}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}