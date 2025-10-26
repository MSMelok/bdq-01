import { useState } from "react";
import { MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchInputProps {
  onSearch: (address: string) => void;
  isLoading?: boolean;
}

export function SearchInput({ onSearch, isLoading = false }: SearchInputProps) {
  const [address, setAddress] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      onSearch(address.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative flex items-center gap-3">
        <div className="relative flex-1">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Enter store address..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            disabled={isLoading}
            data-testid="input-address"
            className="h-14 pl-12 pr-4 text-base shadow-sm"
          />
        </div>
        <Button
          type="submit"
          disabled={!address.trim() || isLoading}
          data-testid="button-analyze"
          className="h-14 px-8 text-base"
        >
          {isLoading ? (
            <>
              <span className="mr-2">Analyzing...</span>
              <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            </>
          ) : (
            <>
              <Search className="mr-2 h-5 w-5" />
              Analyze
            </>
          )}
        </Button>
      </div>
      <p className="mt-3 text-sm text-muted-foreground text-center">
        Example: 3136 Trawood Dr Suite 7.8, El Paso, TX 79936
      </p>
    </form>
  );
}
