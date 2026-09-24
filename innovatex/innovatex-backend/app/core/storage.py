import boto3
from app.config import settings


def _client():
    return boto3.client("s3", region_name=settings.aws_region,
                        aws_access_key_id=settings.aws_access_key_id,
                        aws_secret_access_key=settings.aws_secret_access_key)

async def upload_file(content: bytes, key: str, content_type: str) -> str:
    if not settings.s3_bucket:
        raise RuntimeError("S3_BUCKET is not configured")
    _client().put_object(Bucket=settings.s3_bucket, Key=key, Body=content, ContentType=content_type)
    return f"s3://{settings.s3_bucket}/{key}"

async def create_presigned_url(key: str, expires: int = 3600) -> str:
    if not settings.s3_bucket:
        raise RuntimeError("S3_BUCKET is not configured")
    return _client().generate_presigned_url("get_object", Params={"Bucket": settings.s3_bucket, "Key": key}, ExpiresIn=expires)
