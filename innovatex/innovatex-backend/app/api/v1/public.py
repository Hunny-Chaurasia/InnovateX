from fastapi import APIRouter, HTTPException
from app.models.portfolio import Portfolio
from app.models.user import User
from app.schemas.portfolio import PortfolioResponse

router = APIRouter(tags=["public"])

@router.get("/u/{slug}", response_model=PortfolioResponse)
async def public_portfolio(slug: str):
    portfolio = await Portfolio.find_one(Portfolio.slug == slug, Portfolio.enabled == True)
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    return PortfolioResponse.model_validate(portfolio, from_attributes=True)
