import asyncio
import os
from hume import HumeClient
from hume.expression_measurement.batch import Face, Models
from hume.expression_measurement.batch.types import InferenceBaseRequest
from dotenv import load_dotenv
load_dotenv()


def main():
    # Initialize an authenticated client
    client = HumeClient(api_key=os.environ.get("HUME_API_KEY"))

    # Define the filepath(s) of the file(s) you would like to analyze
    local_filepaths = [
        open("faces.zip", mode="rb"),
        open("david_hume.jpeg", mode="rb")
    ]

    # Create configurations for each model you would like to use (blank = default)
    face_config = Face()

    # Create a Models object
    models_chosen = Models(face=face_config)
    
    # Create a stringified object containing the configuration
    stringified_configs = InferenceBaseRequest(models=models_chosen)

    # Start an inference job and print the job_id
    job_id = client.expression_measurement.batch.start_inference_job_from_local_file(
        json=stringified_configs, file=local_filepaths
    )
    print(job_id)

if __name__ == "__main__":
    asyncio.run(main())
