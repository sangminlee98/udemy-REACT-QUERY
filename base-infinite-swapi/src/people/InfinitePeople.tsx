import InfiniteScroll from "react-infinite-scroller";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Person } from "./Person";

export interface SWData {
  count: number;
  next: string;
  previous: string;
  results: Result[];
}

export interface Result {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: Gender;
  homeworld: string;
  films: string[];
  species: string[];
  vehicles: string[];
  starships: string[];
  created: Date;
  edited: Date;
  url: string;
}

export enum Gender {
  Hermaphrodite = "hermaphrodite",
  Male = "male",
}

const initialUrl = "https://swapi.dev/api/people/";
const fetchUrl = async (url: string) => {
  const response = await fetch(url);
  const json = await response.json();
  return json as SWData;
};

export function InfinitePeople() {
  // TODO: get data for InfiniteScroll via React Query
  // fetchNextPage: 더 많은 데이터가 필요할 때 어느 함수를 실행할지를 InfiniteScroll에 지시
  // hasNextPage: 수집할 데이터가 더 있는지 결정하는 boolean
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
    isError,
    error,
  } = useInfiniteQuery<SWData, Error>(
    ["sw-people"], // 쿼리 키
    // pageParam은 fetchNextPage가 어떻게 보일지 결정하고 다음페이지가 있는지 결정
    ({ pageParam = initialUrl }) => fetchUrl(pageParam), // url인 pageParam을 가져와서 json을 반환
    {
      getNextPageParam: (lastPage) => lastPage.next || undefined,
      // lastPage: 쿼리 함수를 마지막으로 실행한 시점의 데이터
      // pageParam을 lastPage.next로 작성
      // fetchNextPage를 실행하면 next 프로퍼티가 무엇인지에 따라 마지막 페이지에 도착한 다음 pageParam을 사용
      // lastPage가 거짓이면 undefined를 반환
    }
  );
  if (isLoading) return <div className="loading">Loading..</div>; // 로딩중
  if (isError) return <div>Error! {error.toString()}</div>; // 에러
  return (
    <>
      {isFetching && <div className="loading">Loading..</div>}{" "}
      {/** 데이터를 fetching하는 동안의 로딩컴포넌트 */}
      <InfiniteScroll loadMore={() => fetchNextPage()} hasMore={hasNextPage}>
        {data?.pages.map((pageData) => {
          return pageData.results.map((person) => {
            return (
              <Person
                key={person.name}
                name={person.name}
                hairColor={person.hair_color}
                eyeColor={person.eye_color}
              />
            );
          });
        })}
      </InfiniteScroll>
    </>
  );
}
