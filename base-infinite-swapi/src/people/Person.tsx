interface IPersonProps {
  name: string;
  hairColor: string;
  eyeColor: string;
}
export function Person({ name, hairColor, eyeColor }: IPersonProps) {
  return (
    <li>
      {name}
      <ul>
        <li>hair: {hairColor}</li>
        <li>eyes: {eyeColor}</li>
      </ul>
    </li>
  );
}
