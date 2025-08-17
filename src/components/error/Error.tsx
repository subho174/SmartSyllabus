import { Card, CardBody, CardHeader } from "@heroui/card";
import { Loader2, AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@heroui/button";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

const Error = ({
  error,
  refetch,
}: {
  error: Error | null;
  refetch: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<any, Error>>;
}) => {
  return (
    <Card className="relative overflow-hidden border-none bg-background shadow-lg mt-6 max-w-lg mx-auto rounded-xl">
      {/* Glowing accent background */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-gradient-to-br from-red-400/30 via-pink-400/20 to-orange-400/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-gradient-to-tr from-orange-400/20 via-yellow-400/20 to-red-400/30 blur-3xl animate-pulse" />
      </div>

      <CardHeader className="flex flex-col items-center gap-4 mt-6 text-center z-10">
        <div className="flex items-center justify-center rounded-full bg-red-500/10 p-5 shadow-inner">
          <AlertTriangle className="h-12 w-12 text-red-500 animate-pulse" />
        </div>

        <h2 className="text-3xl font-extrabold text-red-600">
          Oops! Something went wrong
        </h2>

        <p className="text-muted-foreground max-w-sm">
          {error instanceof AxiosError
            ? error.response?.data.message
            : "Failed to load summaries. Please try again."}
        </p>
      </CardHeader>

      <CardBody className="flex justify-center pb-10 z-10">
        <Button
          color="danger"
          variant="flat"
          onPress={() => refetch()}
          // startContent={<Loader2 className="h-5 w-5 animate-spin" />}
          startContent={<RotateCcw className="h-4 w-4" />}
          className="hover:shadow-lg"
        >
          Retry
        </Button>
      </CardBody>
    </Card>
  );
};

export default Error;
