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
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import useSubmit from "./hooks/useSubmit";

type ApiResponse = { data: any[]; error?: string };

const API_URL = "http://127.0.0.1:3333/api/";

/**
 * List of accepted file types for upload.
 */
const acceptedFileTypes = [".xlsx", ".xls", ".csv"];

function App() {
  const { handleSubmit, loading, error } = useSubmit(async (event) => {
    const { data, error } = (await fetch(API_URL + "songs", {
      method: "POST",
      body: new FormData(event.target as HTMLFormElement),
    }).then((response) => response.json())) as ApiResponse;

    if (error) throw new Error(error);
    if (data) console.log({ data });
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
            <Tr>
              <Td>Crazy</Td>
              <Td>Aerosmith</Td>
              <Td isNumeric>1990</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default App;
