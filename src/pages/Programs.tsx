import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SEOHead } from "@/components/SEO";
import { SmartHeader } from "@/components/SmartHeader";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Users, Clock, Search, Home, ChevronRight as ChevronRightIcon, CheckCircle, Star, ArrowLeft, ArrowRight, Sparkles, IndianRupee, Headphones } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePaginatedCourses } from "@/hooks/usePaginatedCourses";
import { useDebounce } from "@/hooks/useDebounce";
import { useEnrolledCourseIds } from "@/hooks/useEnrolledCoursesWithCategories";
import { useIsMobile } from "@/hooks/use-mobile";
import { BottomNav } from "@/components/mobile/BottomNav";
import { MobileCategorySheet } from "@/components/mobile/MobileCategorySheet";
import { formatINR } from "@/lib/utils";
import { rewriteStorageUrl } from "@/lib/proxyUrl";
import { DEFAULT_OG_IMAGE } from "@/lib/seo/constants";

import { generateBreadcrumbSchema, generateCollectionPageSchema } from "@/lib/seo/structuredData";

/** Category-specific AI-search content block */
const CategoryAIContent = ({ categoryName }: { categoryName: string }) => {
  const contentMap: Record<string, { question: string; answer: string }> = {
    "Board Exams": {
      question: "What are the best online courses for board exam preparation?",
      answer: "SimpleLecture offers AI-powered board exam courses for SSLC 10th and PUC with personalised learning, 24/7 AI doubt clearing, chapter-wise video lessons, and board-pattern mock tests — all starting at just ₹1000/year. Join 1,00,000+ students scoring 90+ with our mastery-based approach."
    },
    "Entrance Exams": {
      question: "Which online platform is best for NEET and JEE entrance exam preparation?",
      answer: "SimpleLecture provides comprehensive NEET and JEE preparation with AI tutors available round the clock, adaptive practice tests, and expert-curated content. Our affordable courses help students master concepts through personalised learning paths and instant doubt resolution."
    },
    "Professional Courses": {
      question: "Where can I find affordable professional courses online in India?",
      answer: "SimpleLecture offers professional courses including Pharmacy (D.Pharm & B.Pharm) and Nursing (GNM & B.Sc Nursing) preparation with AI-powered learning, curriculum-aligned content, and expert guidance — making quality professional education accessible to all."
    },
    "Skill Development": {
      question: "What are the best skill development courses for students in India?",
      answer: "SimpleLecture's skill development courses combine AI-powered adaptive learning with practical, industry-relevant content. Our platform offers personalised learning paths, instant AI doubt clearing, and affordable pricing to help students build future-ready skills."
    },
  };

  const content = contentMap[categoryName];
  if (!content) return null;

  return (
    <section className="container mx-auto px-4 py-4 md:py-6">
      <div className="max-w-3xl">
        <h2 className="text-lg md:text-xl font-bold mb-2">{content.question}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">{content.answer}</p>
      </div>
    </section>
  );
};

const Programs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Support both path params (SEO-friendly) and query params (backward compatibility)
  const categorySlug = params.categorySlug || searchParams.get("category");
  const subcategorySlug = params.subcategorySlug || searchParams.get("subcategory");
  const subSubcategorySlug = params.subsubcategorySlug || searchParams.get("subsubcategory");
  const pageParam = searchParams.get("page");
  const searchParam = searchParams.get("q");
  
  // Check if we're using path-based routing
  const isPathBasedRouting = !!params.categorySlug;
  
  const [searchQuery, setSearchQuery] = useState(searchParam || "");
  const [sortBy, setSortBy] = useState<"newest" | "popular" | "price-low" | "price-high">("popular");
  const [currentPage, setCurrentPage] = useState(pageParam ? parseInt(pageParam) : 1);
  const coursesPerPage = 12;

  // Debounce search query to avoid excessive API calls
  const debouncedSearch = useDebounce(searchQuery, 400);

  // Fetch categories with SEO metadata (lightweight query)
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories-list-seo"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, slug, parent_id, level, icon, description, display_order, meta_title, meta_description, meta_keywords")
        .eq("is_active", true)
        .order("display_order");
      
      if (error) throw error;
      return data;
    },
    staleTime: 300000, // Cache for 5 minutes
  });

  // Get parent categories (level 1)
  const parentCategories = categories?.filter(cat => cat.level === 1) || [];

  // Get selected parent category
  const selectedParentCategory = categorySlug 
    ? categories?.find(cat => cat.slug === categorySlug)
    : null;

  // Get subcategories for selected parent (level 2)
  const subcategories = selectedParentCategory
    ? categories?.filter(cat => cat.parent_id === selectedParentCategory.id) || []
    : [];

  // Get selected subcategory (level 2)
  const selectedSubcategory = subcategorySlug
    ? categories?.find(cat => cat.slug === subcategorySlug)
    : null;

  // Get sub-subcategories for selected subcategory (level 3)
  const subSubcategories = selectedSubcategory
    ? categories?.filter(cat => cat.parent_id === selectedSubcategory.id) || []
    : [];

  // Get selected sub-subcategory (level 3)
  const selectedSubSubcategory = subSubcategorySlug
    ? categories?.find(cat => cat.slug === subSubcategorySlug)
    : null;

  // Dynamic SEO metadata generation
  const pageTitle = useMemo(() => {
    const selected = selectedSubSubcategory || selectedSubcategory || selectedParentCategory;
    if (selected?.meta_title) return selected.meta_title;
    if (selected?.name) return `${selected.name} Online Courses`;
    return "Programs & Courses";
  }, [selectedParentCategory, selectedSubcategory, selectedSubSubcategory]);

  const pageDescription = useMemo(() => {
    const selected = selectedSubSubcategory || selectedSubcategory || selectedParentCategory;
    if (selected?.meta_description) return selected.meta_description;
    if (selected?.description) return selected.description;
    if (selected?.name) return `Explore ${selected.name} courses at SimpleLecture. Comprehensive preparation and expert guidance.`;
    return "Explore our comprehensive programs for board exams, NEET, JEE, and more";
  }, [selectedParentCategory, selectedSubcategory, selectedSubSubcategory]);

  const pageKeywords = useMemo(() => {
    const selected = selectedSubSubcategory || selectedSubcategory || selectedParentCategory;
    if (selected?.meta_keywords) return selected.meta_keywords;
    const parts = [
      selectedParentCategory?.name,
      selectedSubcategory?.name,
      selectedSubSubcategory?.name,
      "online courses",
      "SimpleLecture"
    ].filter(Boolean);
    return parts.join(", ");
  }, [selectedParentCategory, selectedSubcategory, selectedSubSubcategory]);

  const canonicalUrl = useMemo(() => {
    const base = "https://simplelecture.com/programs";
    const parts = [categorySlug, subcategorySlug, subSubcategorySlug].filter(Boolean);
    return parts.length > 0 ? `${base}/${parts.join("/")}` : base;
  }, [categorySlug, subcategorySlug, subSubcategorySlug]);

  // Generate breadcrumb structured data
  const breadcrumbSchema = useMemo(() => {
    const items = [
      { name: "Home", url: "https://simplelecture.com" },
      { name: "Programs", url: "https://simplelecture.com/programs" }
    ];
    
    if (selectedParentCategory) {
      items.push({
        name: selectedParentCategory.name,
        url: `https://simplelecture.com/programs/${categorySlug}`
      });
    }
    if (selectedSubcategory) {
      items.push({
        name: selectedSubcategory.name,
        url: `https://simplelecture.com/programs/${categorySlug}/${subcategorySlug}`
      });
    }
    if (selectedSubSubcategory) {
      items.push({
        name: selectedSubSubcategory.name,
        url: `https://simplelecture.com/programs/${categorySlug}/${subcategorySlug}/${subSubcategorySlug}`
      });
    }
    
    return generateBreadcrumbSchema(items);
  }, [categorySlug, subcategorySlug, subSubcategorySlug, selectedParentCategory, selectedSubcategory, selectedSubSubcategory]);

  // Only run courses query when categories are loaded (prevents double execution)
  const categoriesReady = !categoriesLoading && (
    !categorySlug || selectedParentCategory !== undefined
  );

  // Fetch courses with server-side pagination and search
  const { data: paginatedData, isLoading: coursesLoading, isFetching } = usePaginatedCourses({
    page: currentPage,
    pageSize: coursesPerPage,
    searchQuery: debouncedSearch,
    categoryId: selectedParentCategory?.id,
    subcategoryId: selectedSubcategory?.id,
    subSubcategoryId: selectedSubSubcategory?.id,
    sortBy,
    enabled: categoriesReady,
  });

  const { courses = [], totalCount = 0, totalPages = 0 } = paginatedData || {};

  // Generate combined structured data (breadcrumb + optional CollectionPage)
  const combinedStructuredData = useMemo(() => {
    const selected = selectedSubSubcategory || selectedSubcategory || selectedParentCategory;
    if (!selected || !courses || courses.length === 0) return breadcrumbSchema;

    const collectionSchema = generateCollectionPageSchema(
      `${selected.name} Courses`,
      canonicalUrl,
      pageDescription,
      courses.map((c) => ({
        name: c.name,
        url: `https://simplelecture.com/course/${c.slug}`
      }))
    );

    return {
      "@context": "https://schema.org",
      "@graph": [breadcrumbSchema, collectionSchema]
    };
  }, [breadcrumbSchema, selectedParentCategory, selectedSubcategory, selectedSubSubcategory, courses, canonicalUrl, pageDescription]);

  // Get enrolled course IDs to show "Enrolled" badge
  const { data: enrolledCourseIds } = useEnrolledCourseIds();

  // Navigation helper for path-based routing
  const navigateToCategory = useCallback((category?: string, subcategory?: string, subsubcategory?: string) => {
    const parts = [category, subcategory, subsubcategory].filter(Boolean);
    if (parts.length > 0) {
      navigate(`/programs/${parts.join("/")}`);
    } else {
      navigate("/programs");
    }
  }, [navigate]);

  // Reset page when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [debouncedSearch, categorySlug, subcategorySlug, subSubcategorySlug, sortBy]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Update URL with page param
    if (isPathBasedRouting) {
      const newParams = new URLSearchParams(searchParams);
      if (page > 1) {
        newParams.set("page", page.toString());
      } else {
        newParams.delete("page");
      }
      setSearchParams(newParams);
    } else {
      const params = new URLSearchParams();
      if (categorySlug) params.set("category", categorySlug);
      if (subcategorySlug) params.set("subcategory", subcategorySlug);
      if (subSubcategorySlug) params.set("subsubcategory", subSubcategorySlug);
      if (page > 1) params.set("page", page.toString());
      if (debouncedSearch) params.set("q", debouncedSearch);
      setSearchParams(params);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  // Mobile layout
  if (isMobile) {
    return (
      <>
        <SEOHead
          title={pageTitle}
          description={pageDescription}
          keywords={pageKeywords}
          canonicalUrl={canonicalUrl}
          ogImage={DEFAULT_OG_IMAGE}
          structuredData={combinedStructuredData}
        />
        
        {/* Mobile Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-indigo-700 px-4 pt-10 pb-8 rounded-b-[1.5rem]">
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute bottom-0 left-1/3 h-24 w-24 rounded-full bg-indigo-300/20 blur-2xl" />
          <div className="relative flex items-center gap-3 mb-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/10"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-white text-lg font-bold leading-tight">
                {selectedSubSubcategory?.name || selectedSubcategory?.name || selectedParentCategory?.name || "Browse Courses"}
              </h1>
              <p className="text-white/70 text-xs mt-0.5">
                {isFetching ? "Loading..." : `${totalCount} courses available`}
              </p>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-11 bg-white border-0 rounded-2xl shadow-lg text-foreground placeholder:text-muted-foreground text-sm"
            />
          </div>

          {/* Trust chips */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {[{ icon: Users, label: "1L+ Students" }, { icon: Star, label: "4.9★" }, { icon: Headphones, label: "24/7 AI" }, { icon: IndianRupee, label: "From ₹1000/yr" }].map((b) => {
              const Icon = b.icon;
              return (
                <span key={b.label} className="inline-flex items-center gap-1 rounded-full bg-white/15 backdrop-blur px-2.5 py-1 text-[10px] font-medium text-white">
                  <Icon className="h-3 w-3" />
                  {b.label}
                </span>
              );
            })}
          </div>
        </div>

        <MobileCategorySheet
          categorySlug={categorySlug}
          subcategorySlug={subcategorySlug}
          subSubcategorySlug={subSubcategorySlug}
          selectedParentCategory={selectedParentCategory}
          selectedSubcategory={selectedSubcategory}
          selectedSubSubcategory={selectedSubSubcategory}
          parentCategories={parentCategories}
          subcategories={subcategories}
          subSubcategories={subSubcategories}
          navigateToCategory={navigateToCategory}
        />

        <div className="min-h-screen bg-background pb-24">

          {/* Results Count & Sort */}
          <div className="px-4 flex items-center justify-between mb-3">
            <span className="text-xs text-muted-foreground">
              {isFetching ? "Loading..." : `${totalCount} courses`}
            </span>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
              <SelectTrigger className="w-[120px] h-8 text-xs">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="popular">Popular</SelectItem>
                <SelectItem value="price-low">Price ↑</SelectItem>
                <SelectItem value="price-high">Price ↓</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Course List */}
          <div className="px-4 space-y-3">
            {coursesLoading || categoriesLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="flex gap-3 p-2">
                    <Skeleton className="h-20 w-20 rounded-lg flex-shrink-0" />
                    <div className="flex-1 space-y-2 py-1">
                      <Skeleton className="h-3 w-3/4" />
                      <Skeleton className="h-2 w-1/2" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                </Card>
              ))
            ) : courses.length > 0 ? (
              courses.map((course) => (
                <Link key={course.id} to={`/course/${course.slug}`}>
                  <Card className="group overflow-hidden cursor-pointer hover:shadow-md transition-all active:scale-[0.99] border-border/60">
                    <div className="flex gap-3 p-2">
                      {/* Course Image */}
                      <div className="relative h-20 w-24 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-primary/20 to-accent/20">
                        {(course.course_thumbnails?.storage_url || course.thumbnail_url) && (
                          <img
                            src={rewriteStorageUrl(course.course_thumbnails?.storage_url || course.thumbnail_url) || undefined}
                            alt={course.name}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        )}
                        {enrolledCourseIds?.has(course.id) && (
                          <div className="absolute top-1 left-1 bg-emerald-500 text-white px-1.5 py-0.5 rounded-md text-[8px] font-bold">
                            ✓ Enrolled
                          </div>
                        )}
                        {!enrolledCourseIds?.has(course.id) && course.rating ? (
                          <div className="absolute bottom-1 left-1 bg-black/70 text-white px-1 py-0.5 rounded-md text-[9px] font-semibold flex items-center gap-0.5 backdrop-blur">
                            <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                            {course.rating.toFixed(1)}
                          </div>
                        ) : course.price_inr === 0 ? (
                          <div className="absolute bottom-1 left-1 bg-emerald-500 text-white px-1.5 py-0.5 rounded-md text-[9px] font-bold">
                            Free
                          </div>
                        ) : null}
                      </div>

                      {/* Course Info */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                        <div>
                          <h3 className="font-semibold text-foreground line-clamp-2 text-xs leading-tight">
                            {course.name}
                          </h3>
                          <p className="text-[10px] text-muted-foreground mt-1 line-clamp-1 flex items-center gap-1">
                            <Clock className="h-2.5 w-2.5" />
                            {course.duration_months ? `${course.duration_months}mo` : course.short_description || "Learn anytime"}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between gap-2">
                          {course.price_inr > 0 ? (
                            <>
                              <span className="font-bold text-primary text-sm">
                                {formatINR(course.price_inr)}
                              </span>
                              {course.original_price_inr && course.original_price_inr > course.price_inr && (
                                <span className="text-[10px] text-muted-foreground line-through">
                                  {formatINR(course.original_price_inr)}
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="font-bold text-emerald-600 text-sm">Free</span>
                          )}
                          <span className="ml-auto text-[10px] text-muted-foreground flex items-center gap-0.5">
                            <ArrowRight className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))
            ) : (
              <Card className="p-8 text-center">
                <p className="font-medium mb-2">No courses found</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Try adjusting your search or filters
                </p>
                <Button 
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    navigateToCategory();
                  }}
                >
                  Clear Filters
                </Button>
              </Card>
            )}
          </div>

          {/* Load More */}
          {totalPages > 1 && currentPage < totalPages && (
            <div className="px-4 py-6 text-center">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                className="w-full"
              >
                Load More
              </Button>
            </div>
          )}
        </div>

        <BottomNav />
      </>
    );
  }

  // Desktop layout
  return (
    <>
      <SEOHead
        title={pageTitle}
        description={pageDescription}
        keywords={pageKeywords}
        canonicalUrl={canonicalUrl}
        ogImage={DEFAULT_OG_IMAGE}
        structuredData={combinedStructuredData}
      />
      <SmartHeader />
      
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary via-indigo-600 to-violet-700 text-white">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-indigo-300/20 blur-3xl" />
          <div className="absolute top-10 right-1/3 h-32 w-32 rounded-full bg-amber-300/20 blur-2xl" />

          {/* Breadcrumb */}
          <div className="relative border-b border-white/10 hidden md:block">
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-white/70">
                <Link to="/" className="hover:text-white transition-colors flex items-center gap-1">
                  <Home className="h-4 w-4" />
                  Home
                </Link>
                <ChevronRightIcon className="h-4 w-4" />
                {selectedParentCategory ? (
                  <Link to="/programs" className="hover:text-white transition-colors">
                    Programs
                  </Link>
                ) : (
                  <span className="text-white font-medium">Programs</span>
                )}
                {selectedParentCategory && (
                  <>
                    <ChevronRightIcon className="h-4 w-4" />
                    {selectedSubcategory ? (
                      <Link 
                        to={`/programs/${categorySlug}`} 
                        className="hover:text-white transition-colors"
                      >
                        {selectedParentCategory.name}
                      </Link>
                    ) : (
                      <span className="text-white font-medium">{selectedParentCategory.name}</span>
                    )}
                  </>
                )}
                {selectedSubcategory && (
                  <>
                    <ChevronRightIcon className="h-4 w-4" />
                    {selectedSubSubcategory ? (
                      <Link 
                        to={`/programs/${categorySlug}/${subcategorySlug}`}
                        className="hover:text-white transition-colors"
                      >
                        {selectedSubcategory.name}
                      </Link>
                    ) : (
                      <span className="text-white font-medium">{selectedSubcategory.name}</span>
                    )}
                  </>
                )}
                {selectedSubSubcategory && (
                  <>
                    <ChevronRightIcon className="h-4 w-4" />
                    <span className="text-white font-medium">{selectedSubSubcategory.name}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="relative container mx-auto px-4 py-12 md:py-16 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-medium">
              <Sparkles className="h-3.5 w-3.5" />
              India's #1 AI-powered learning platform
            </span>
            <h1 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight">
              {selectedSubSubcategory?.name || selectedSubcategory?.name || selectedParentCategory?.name || "Find Your Perfect Course"}
            </h1>
            <p className="mt-3 text-white/80 max-w-2xl mx-auto text-sm md:text-base">
              {selectedSubSubcategory?.description || selectedSubcategory?.description || selectedParentCategory?.description || 
               "Master board exams, crack NEET & JEE, or build career-ready skills with AI-powered courses, expert faculty, and affordable pricing."}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mt-6">
              {[{ icon: Users, label: "1,00,000+ Students" }, { icon: Star, label: "4.9★ Rating" }, { icon: Headphones, label: "24/7 AI Support" }, { icon: IndianRupee, label: "From ₹1000/yr" }].map((badge) => {
                const Icon = badge.icon;
                return (
                  <div key={badge.label} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur rounded-full border border-white/15 text-xs font-medium">
                    <Icon className="w-3.5 h-3.5 text-amber-300" />
                    <span>{badge.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Category AI Content */}
        {selectedParentCategory && (
          <CategoryAIContent categoryName={selectedParentCategory.name} />
        )}

        {/* Category Navigation */}
        {!categorySlug && (
          <div className="container mx-auto px-4 py-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold tracking-tight">Browse by Category</h2>
              <span className="text-sm text-muted-foreground">{parentCategories.length} categories</span>
            </div>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto gap-2 bg-muted/50 p-1.5 rounded-2xl">
                <TabsTrigger 
                  value="all"
                  onClick={() => navigateToCategory()}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl shadow-sm"
                >
                  All Programs
                </TabsTrigger>
                {parentCategories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.slug}
                    onClick={() => navigateToCategory(category.slug)}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-xl shadow-sm"
                  >
                    <span className="mr-1.5">{category.icon}</span>
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        )}

        {/* Subcategory Cards (Level 2) */}
        {categorySlug && !subcategorySlug && subcategories.length > 0 && (
          <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold tracking-tight mb-6">Choose Subcategory</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
              <Card 
                className="group cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border-border/60 hover:border-primary/40"
                onClick={() => navigateToCategory(categorySlug)}
              >
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-indigo-500/15 text-2xl transition-transform group-hover:scale-110">
                    📚
                  </div>
                  <p className="font-semibold text-sm">All</p>
                  <p className="text-xs text-muted-foreground mt-1">View all courses</p>
                </CardContent>
              </Card>
              {subcategories.map((subcat) => (
                <Card
                  key={subcat.id}
                  className="group cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border-border/60 hover:border-primary/50"
                  onClick={() => navigateToCategory(categorySlug, subcat.slug)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-indigo-500/15 text-2xl transition-transform group-hover:scale-110">
                      {subcat.icon || "📖"}
                    </div>
                    <p className="font-semibold text-sm">{subcat.name}</p>
                    {subcat.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {subcat.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Sub-Subcategory Cards (Level 3) */}
        {categorySlug && subcategorySlug && !subSubcategorySlug && subSubcategories.length > 0 && (
          <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold tracking-tight mb-6">Choose Specific Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
              <Card 
                className="group cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border-border/60 hover:border-primary/40"
                onClick={() => navigateToCategory(categorySlug, subcategorySlug)}
              >
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-indigo-500/15 text-2xl transition-transform group-hover:scale-110">
                    📚
                  </div>
                  <p className="font-semibold text-sm">All</p>
                  <p className="text-xs text-muted-foreground mt-1">View all {selectedSubcategory?.name}</p>
                </CardContent>
              </Card>
              {subSubcategories.map((subsubcat) => (
                <Card
                  key={subsubcat.id}
                  className="group cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border-border/60 hover:border-primary/50"
                  onClick={() => navigateToCategory(categorySlug, subcategorySlug, subsubcat.slug)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-indigo-500/15 text-2xl transition-transform group-hover:scale-110">
                      {subsubcat.icon || "📖"}
                    </div>
                    <p className="font-semibold text-sm">{subsubcat.name}</p>
                    {subsubcat.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {subsubcat.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Filters & Search */}
        <div className="container mx-auto px-4 py-6 md:py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 mb-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold tracking-tight">
                {selectedSubSubcategory?.name || selectedSubcategory?.name || selectedParentCategory?.name || "All Programs"}
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {isFetching ? "Loading..." : `${totalCount} course${totalCount !== 1 ? 's' : ''} found`}
              </p>
            </div>
            <div className="flex flex-1 md:justify-end items-center gap-3">
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10 rounded-xl"
                />
              </div>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
                <SelectTrigger className="w-[180px] text-sm rounded-xl">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Course Grid */}
          {coursesLoading || categoriesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-44 w-full rounded-none" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-5 w-4/5" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-9 w-full" />
                  </div>
                </Card>
              ))}
            </div>
          ) : courses.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {courses.map((course) => (
                  <Link key={course.id} to={`/course/${course.slug}`}>
                    <Card className="group h-full overflow-hidden border-border/60 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer">
                      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
                        {(course.course_thumbnails?.storage_url || course.thumbnail_url) && (
                          <img
                            src={rewriteStorageUrl(course.course_thumbnails?.storage_url || course.thumbnail_url) || undefined}
                            alt={course.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        {enrolledCourseIds?.has(course.id) ? (
                          <Badge className="absolute top-3 right-3 bg-emerald-500 hover:bg-emerald-500 border-0 shadow-lg">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Enrolled
                          </Badge>
                        ) : course.price_inr === 0 ? (
                          <Badge className="absolute top-3 right-3 bg-emerald-500 hover:bg-emerald-500 border-0 shadow-lg">Free</Badge>
                        ) : course.rating ? (
                          <Badge className="absolute top-3 right-3 bg-black/60 backdrop-blur border-0 text-amber-300 shadow-lg">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400 mr-1" />
                            {course.rating.toFixed(1)}
                          </Badge>
                        ) : null}
                        {course.duration_months && (
                          <Badge variant="secondary" className="absolute bottom-3 left-3 bg-background/80 backdrop-blur border-0">
                            <Clock className="h-3 w-3 mr-1" />
                            {course.duration_months} {course.duration_months === 1 ? 'month' : 'months'}
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                          {course.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1.5 mb-3 line-clamp-2">
                          {course.short_description || course.instructor_name || "Expert Instructor"}
                        </p>
                        <div className="flex items-center justify-between">
                          <div>
                            {course.price_inr > 0 ? (
                              <div className="flex items-baseline gap-1.5">
                                <span className="text-lg font-bold">{formatINR(course.price_inr)}</span>
                                {course.original_price_inr && course.original_price_inr > course.price_inr && (
                                  <span className="text-xs text-muted-foreground line-through">
                                    {formatINR(course.original_price_inr)}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-lg font-bold text-emerald-600">Free</span>
                            )}
                          </div>
                          {course.student_count > 0 && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Users className="h-3.5 w-3.5" />
                              {course.student_count >= 1000 
                                ? `${(course.student_count / 1000).toFixed(1)}k` 
                                : course.student_count.toLocaleString()}
                            </div>
                          )}
                        </div>
                        <Button size="sm" className="w-full mt-4" variant="outline">
                          View Course
                          <ArrowRight className="h-4 w-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-xl"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex items-center gap-1.5">
                    {getPageNumbers().map((pageNum, idx) => (
                      pageNum === "..." ? (
                        <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground">...</span>
                      ) : (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="icon"
                          className="rounded-xl"
                          onClick={() => handlePageChange(pageNum as number)}
                        >
                          {pageNum}
                        </Button>
                      )
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-xl"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <Card className="p-14 text-center border-dashed">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-xl font-semibold mb-2">No courses found</p>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Try adjusting your search or filters to discover more programs
              </p>
              <Button onClick={() => {
                setSearchQuery("");
                navigateToCategory();
                setCurrentPage(1);
              }}>
                Clear All Filters
              </Button>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Programs;
