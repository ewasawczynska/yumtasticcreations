import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCategories } from "../../redux/categories/selectors";
import { getMainPageRecipes } from "../../redux/mainPageRecipes/operations";
import { getCategories } from "../../redux/categories/operations";
import { useMediaQuery } from "@uidotdev/usehooks";
import { Container, CategoriesList, Category, CategoryTitle, RecipesList, RecipeButton, RecipeElement, RecipeImage, SeeAllButton, ButtonContainer, OtherCategoriesButton } from "./PreviewCategories.styled";

export const PreviewCategories = () => {
    const dispatch = useDispatch();
    const categories = useSelector(selectCategories);
    const [recipes, setRecipes] = useState([]);
    const popularCategories = categories.items; 
    const isMobile = useMediaQuery('(max-width:767px)');
    const isTablet = useMediaQuery('(min-width:768px) and (max-width:1199px)');

   useEffect(() => {
        dispatch(getCategories())
    }, [dispatch])

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                if (popularCategories.length > 0) {
                    const promises = popularCategories.map((category) => {
                        return dispatch(getMainPageRecipes(category));
                    });
                    const results = await Promise.all(promises);
                    const resultsRecipes = results.map((category) => {
                        return {
                            title: category.meta.arg,
                            recipes: category.payload,
                    }
                    }
                    )
                    setRecipes([...resultsRecipes])}
            } catch (err) {
                console.error("Wystąpił błąd:", err);
            }
        };
        fetchRecipes();
    }, [dispatch, popularCategories]);

    const getNumberOfRecipesToRender = () => {
        if (isMobile) {
            return 1;
        } else if (isTablet) {
            return 2;
        } else {
            return 4;
        }
    };

return (
    <Container>
        <CategoriesList>
            {recipes.slice(0, 4).map((category) => (
                <Category>
                    <CategoryTitle>
                        {category.title}
                    </CategoryTitle>
                    <RecipesList>
                    {category.recipes.slice(0, getNumberOfRecipesToRender()).map((recipe) => {
                            return ( 
                            <RecipeElement>    
                            <RecipeButton to="recipe/{recipe.id}">{recipe.title}</RecipeButton>
                            <RecipeImage src={recipe.thumb} alt={recipe.title} />
                            </RecipeElement>
                            )
                        })}
                    </RecipesList>
                    <ButtonContainer>
                    <SeeAllButton to="categories/{category.title}">
                    See all
                   </SeeAllButton>
                   </ButtonContainer>
                </Category>
            ))}
        </CategoriesList>
        <OtherCategoriesButton to="categories">
            Other Categories
        </OtherCategoriesButton>
    </Container>
)
};