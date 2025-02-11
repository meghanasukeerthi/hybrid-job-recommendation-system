
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { getSearchHistory, clearSearchHistory } from "@/utils/searchHistory";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Clock, ArrowLeft, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface SearchHistoryEntry {
  query: string;
  timestamp: number;
}

const SearchHistory = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [history, setHistory] = useState<SearchHistoryEntry[]>([]);

  useEffect(() => {
    setHistory(getSearchHistory());
  }, []);

  const handleSearchClick = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleClearHistory = (range: string) => {
    clearSearchHistory(range);
    setHistory(getSearchHistory());
    
    const rangeText = {
      last_hour: "last hour's",
      last_day: "last day's",
      last_week: "last week's",
      last_month: "last month's",
      all: "all"
    }[range];

    toast({
      title: "Search History Cleared",
      description: `Successfully cleared ${rangeText} search history.`,
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="destructive"
                  className="bg-red-500 hover:bg-red-600"
                  disabled={history.length === 0}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear History
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => handleClearHistory('last_hour')}>
                  Clear Last Hour
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleClearHistory('last_day')}>
                  Clear Last Day
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleClearHistory('last_week')}>
                  Clear Last Week
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleClearHistory('last_month')}>
                  Clear Last Month
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleClearHistory('all')}
                  className="text-red-500 focus:text-red-500"
                >
                  Clear All History
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

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
                  key={`${entry.query}-${entry.timestamp}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card 
                    className="hover:shadow-lg transition-all duration-300 group cursor-pointer"
                    onClick={() => handleSearchClick(entry.query)}
                  >
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
