
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { getSearchHistory } from "@/utils/searchHistory";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Clock, ArrowLeft } from "lucide-react";

interface SearchHistoryEntry {
  query: string;
  timestamp: number;
}

const SearchHistory = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<SearchHistoryEntry[]>([]);

  useEffect(() => {
    const rawHistory = getSearchHistory();
    const historyWithTimestamps = rawHistory.map(query => ({
      query,
      timestamp: Date.now() // In a real app, we'd store timestamps with queries
    }));
    setHistory(historyWithTimestamps);
  }, []);

  const handleSearchClick = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <h3 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Search History
          </h3>

          {history.length === 0 ? (
            <div className="text-center mt-16 space-y-4 bg-card p-8 rounded-lg shadow-lg">
              <p className="text-xl text-muted-foreground">No search history yet.</p>
              <Button 
                onClick={() => navigate('/')}
                className="text-primary hover:text-primary/80"
              >
                Start searching
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {history.map((entry, index) => (
                <motion.div
                  key={`${entry.query}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-all duration-300 group cursor-pointer"
                        onClick={() => handleSearchClick(entry.query)}>
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-primary">
                          <Search className="w-4 h-4" />
                          <span className="font-medium group-hover:text-primary/80 transition-colors">
                            {entry.query}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 mr-2" />
                          {formatDistanceToNow(entry.timestamp, { addSuffix: true })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchHistory;
