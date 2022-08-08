interface ISpeciesProps {
  name: string;
  language: string;
  averageLifespan: string;
}

export function Species({ name, language, averageLifespan }: ISpeciesProps) {
  return (
    <li>
      {name}
      <ul>
        <li>language: {language}</li>
        <li>average lifespan: {averageLifespan}</li>
      </ul>
    </li>
  );
}
