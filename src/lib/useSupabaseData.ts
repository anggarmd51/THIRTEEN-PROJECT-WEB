import { useState, useEffect, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "./supabase";
import {
  CarUnit,
  PortfolioItem,
} from "../types";
import {
  fetchCarsFromSupabase,
  fetchPortfoliosFromSupabase,
} from "./supabaseDb";

/**
 * Custom hook for dynamic, real-time Cars Catalog from Supabase
 */
export function useSupabaseCars() {
  const [cars, setCars] = useState<CarUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingSupabase, setIsUsingSupabase] = useState(false);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await fetchCarsFromSupabase();

    if (result.error) {
      setError(result.error.message);
      setCars([]);
      setIsUsingSupabase(false);
    } else {
      setCars(result.data);
      setIsUsingSupabase(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCars();

    // Subscribe to real-time changes on 'cars' table
    try {
      const channel = supabase
        .channel("public:cars_live")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "cars" },
          () => {
            fetchCars();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch {
      // Ignored if subscription is unavailable
    }
  }, [fetchCars]);

  return {
    cars,
    loading,
    error,
    isUsingSupabase,
    refetch: fetchCars,
    isConfigured: isSupabaseConfigured(),
  };
}

/**
 * Custom hook for dynamic, real-time Portfolio Gallery from Supabase
 */
export function useSupabasePortfolios() {
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingSupabase, setIsUsingSupabase] = useState(false);

  const fetchPortfolios = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await fetchPortfoliosFromSupabase();

    if (result.error) {
      setError(result.error.message);
      setPortfolios([]);
      setIsUsingSupabase(false);
    } else {
      setPortfolios(result.data);
      setIsUsingSupabase(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPortfolios();

    // Subscribe to real-time changes on 'portfolio'
    try {
      const channel = supabase
        .channel("public:portfolio_live")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "portfolio" },
          () => {
            fetchPortfolios();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch {
      // Ignored if subscription is unavailable
    }
  }, [fetchPortfolios]);

  return {
    portfolios,
    loading,
    error,
    isUsingSupabase,
    refetch: fetchPortfolios,
    isConfigured: isSupabaseConfigured(),
  };
}
