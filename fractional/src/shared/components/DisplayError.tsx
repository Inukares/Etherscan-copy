export const DisplayError = ({
  error,
  message,
}: {
  error: unknown;
  message: string;
}) => {
  console.log(error);
  return <h2>{message}</h2>;
};
