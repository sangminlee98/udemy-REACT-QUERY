import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroller";
import { Species } from "./Species";

export interface SpeciesData {
  count: number;
  next: string;
  previous: null;
  results: Result[];
}

export interface Result {
  name: string;
  classification: string;
  designation: Designation;
  average_height: string;
  skin_colors: string;
  hair_colors: string;
  eye_colors: string;
  average_lifespan: string;
  homeworld: null | string;
  language: string;
  people: string[];
  films: string[];
  created: Date;
  edited: Date;
  url: string;
}

export enum Designation {
  Reptilian = "reptilian",
  Sentient = "sentient",
}

const initialUrl = "https://swapi.dev/api/species/";
const fetchUrl = async (url: string) => {
  const response = await fetch(url);
  return response.json();
};

export function InfiniteSpecies() {
  // TODO: get data for InfiniteScroll via React Query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
    isError,
    error,
  } = useInfiniteQuery<SpeciesData, Error>(
    ["sw-species"],
    ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    {
      getNextPageParam: (lastPage) => lastPage.next || undefined,
    }
  );
  if (isLoading) return <div className="loading">Loading...</div>;
  if (isError) return <div>ERROR! {JSON.stringify(error)}</div>;
  return (
    <>
      {isFetching && <div className="loading">Loading...</div>}
      <InfiniteScroll
        loadMore={() => {
          fetchNextPage();
        }}
        hasMore={hasNextPage}
      >
        {data.pages.map((pageData) => {
          return pageData.results.map((species) => {
            return (
              <Species
                name={species.name}
                language={species.language}
                averageLifespan={species.average_lifespan}
              />
            );
          });
        })}
      </InfiniteScroll>
      ;
    </>
  );
}
