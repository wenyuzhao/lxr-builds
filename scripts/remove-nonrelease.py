# Move build artifacts from GitHub to Google Cloud Storage
# NOTE: Set GOOGLE_APPLICATION_CREDENTIALS=./creds.json before running this script

from google.cloud import storage
import requests
import io
import warnings

warnings.filterwarnings("ignore")

BUCKET_NAME = "lxr-builds"

GCS_CLIENT = storage.Client()
BUCKET = GCS_CLIENT.bucket(BUCKET_NAME)


def upload_file(name: str, source: io.BytesIO):
    assert not name.endswith(".tar.gz")
    name_with_ext = f"{name}.tar.gz"
    blob = BUCKET.blob(name_with_ext)
    if blob.exists():
        return
    blob.upload_from_string(source.getvalue(), content_type="application/gzip")


def download_file(name: str) -> io.BytesIO:
    url = f"https://github.com/wenyuzhao/lxr-builds/releases/download/nightly/{name}.tar.gz"
    # Download the file
    response = requests.get(url)
    file = io.BytesIO(response.content)
    return file


def process_file(name: str, i: int, total: int):
    assert not name.endswith(".tar.gz")
    tag = f"[{i}/{total}]"
    print(f"{tag} {name}")
    try:
        if BUCKET.blob(f"{name}.tar.gz").exists():
            return
        print(f"{tag} . downloading ... ", end="", flush=True)
        with download_file(name) as source:
            print("✔")
            print(f"{tag} . uploading ... ", end="", flush=True)
            upload_file(name, source)
            print("✔")
        print(f"{tag} ✅ {name}")
    except Exception as e:
        print("❌")
        print(f"{tag} ❌ ERROR: {e}")
        # Append the name to errors.txt
        with open("errors.txt", "a") as f:
            f.write(f"{name}\n")


def main():
    blobs_to_delete = []
    for blob in BUCKET.list_blobs():
        if "release" not in blob.name:
            assert "-fastdebug-" in blob.name or "-slowdebug-" in blob.name
            blobs_to_delete.append(blob)
    print(len(blobs_to_delete))
    print([b.name for b in blobs_to_delete[:16]])

    print(f"Deleting {len(blobs_to_delete)} blobs ...")
    unprocessed = [b for b in blobs_to_delete]
    count = 0
    while len(unprocessed) > 0:
        with GCS_CLIENT.batch():
            i = 0
            while blob := unprocessed.pop():
                i += 1
                count += 1
                blob.delete()
                print(f"[{count}/{len(blobs_to_delete)}] {blob.name}")
                if i >= 1000 or len(unprocessed) == 0:
                    break
    print("Done.")

if __name__ == "__main__":
    main()
