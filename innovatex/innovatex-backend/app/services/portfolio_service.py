import secrets
import string
from app.models.portfolio import Portfolio
from app.utils.slugify import slugify

async def unique_slug(name: str) -> str:
    for _ in range(20):
        suffix = "".join(secrets.choice(string.ascii_lowercase + string.digits) for _ in range(4))
        slug = f"{slugify(name)}-{suffix}"
        if await Portfolio.find_one(Portfolio.slug == slug) is None:
            return slug
    raise RuntimeError("Could not generate a unique portfolio slug")

async def ensure_portfolio(user_id: str, name: str, bio: str | None = None) -> Portfolio:
    portfolio = await Portfolio.find_one(Portfolio.user_id == user_id)
    if portfolio:
        return portfolio
    portfolio = Portfolio(slug=await unique_slug(name), user_id=user_id, bio=bio)
    await portfolio.insert()
    return portfolio
