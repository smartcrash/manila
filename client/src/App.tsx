import {
  Button,
  Container,
  Divider,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  HStack,
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import useFetch from "./hooks/useFetch";
import useSubmit from "./hooks/useSubmit";

type Song = {
  id: number;
  song_name: string;
  band: string;
  year: number;
};

type StoreSongResponse = { data?: Song[]; error?: string };

const API_URL = "http://127.0.0.1:3333/api/";
const url = API_URL + "songs";

/**
 * List of accepted file types for upload.
 */
const acceptedFileTypes = [".xlsx", ".xls", ".csv"];

function App() {
  const [execute, { data, loading: fetching }] = useFetch<Song[]>(url);

  const { handleSubmit, loading, error } = useSubmit(async (event) => {
    const { data, error } = (await fetch(API_URL + "songs", {
      method: "POST",
      body: new FormData(event.target as HTMLFormElement),
    }).then((response) => response.json())) as StoreSongResponse;

    if (error) throw new Error(error);
    if (data) execute();
  });

  return (
    <Container paddingTop={"16"}>
      <form onSubmit={handleSubmit}>
        <HStack alignItems={"flex-start"}>
          <FormControl isInvalid={!!error?.message}>
            <Input
              accept={acceptedFileTypes.join(", ")}
              id="file"
              type="file"
              name="file"
              paddingTop="1.5"
              disabled={loading}
            />
            <FormErrorMessage>{error?.message}</FormErrorMessage>
            <FormHelperText>
              Accepted formats: {acceptedFileTypes.join(", ")}
            </FormHelperText>
          </FormControl>
          <Button type="submit" colorScheme="red" isLoading={loading}>
            Upload
          </Button>
        </HStack>
      </form>

      <Divider marginY={"5"} />

      {fetching ? (
        <Text>Loading...</Text>
      ) : (
        <TableContainer>
          <Table variant={"striped"}>
            <Thead>
              <Tr>
                <Th>Song Name</Th>
                <Th>Band</Th>
                <Th isNumeric>Year</Th>
              </Tr>
            </Thead>

            <Tbody>
              {data?.map(({ id, song_name, band, year }) => (
                <Tr key={id}>
                  <Td>{song_name}</Td>
                  <Td>{band}</Td>
                  <Td isNumeric>{year}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}

export default App;
