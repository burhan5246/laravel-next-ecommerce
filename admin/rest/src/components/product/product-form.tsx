import Input from '@/components/ui/input';
import TextArea from '@/components/ui/text-area';
//import CKEditor from '@/components/ui/ck-editor';
import { useForm, FormProvider } from 'react-hook-form';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import Label from '@/components/ui/label';
import Radio from '@/components/ui/radio/radio';
import { useRouter } from 'next/router';
import { yupResolver } from '@hookform/resolvers/yup';
import FileInput from '@/components/ui/file-input';
import { productValidationSchema } from './product-validation-schema';
import ProductVariableForm from './product-variable-form';
import ProductSimpleForm from './product-simple-form';
import ProductGroupInput from './product-group-input';
import ProductCategoryInput from './product-category-input';
import ProductTypeInput from './product-type-input';
import { ProductType, Product, Shipping } from '@/types';
import { useTranslation } from 'next-i18next';
import { useShopQuery } from '@/data/shop';
import ProductTagInput from './product-tag-input';
import { Config } from '@/config';
import Alert from '@/components/ui/alert';
import { useState, useEffect } from 'react';
import ProductAuthorInput from './product-author-input';
import ProductManufacturerInput from './product-manufacturer-input';
import { EditIcon } from '@/components/icons/edit';
import {
  getProductDefaultValues,
  getProductInputValues,
  ProductFormValues,
} from './form-utils';
import { getErrorMessage } from '@/utils/form-error';
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from '@/data/product';
import { split, join } from 'lodash';
import SelectInput from '@/components/ui/select-input';

import dynamic from 'next/dynamic';
const CKEditorComp = dynamic(() => import('@/components/ui/ck-editor'), {
  ssr: false,
});

type ProductFormProps = {
  initialValues?: Product | null;
  shippingClasses: Shipping[];
};

export default function CreateOrUpdateProductForm({
  initialValues,
  shippingClasses,
}: ProductFormProps) {
  const router = useRouter();
  const [isSlugDisable, setIsSlugDisable] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [editorLoaded, setEditorLoaded] = useState<boolean>(false);
  const [data, setData] = useState<string | null>('');

  const [input, setInput] = useState<any>({
    description: initialValues?.description,
  });
  const { t } = useTranslation();

  useEffect(() => {
    setEditorLoaded(true);
  }, []);

  const { data: shopData } = useShopQuery(
    { slug: router.query.shop as string },
    {
      enabled: !!router.query.shop,
    }
  );


  const shopId = shopData?.id!;
  const isNewTranslation = router?.query?.action === 'translate';
  const isSlugEditable =
    router?.query?.action === 'edit' &&
    router?.locale === Config.defaultLanguage;
  const methods = useForm<ProductFormValues>({
    resolver: yupResolver(productValidationSchema),
    shouldUnregister: true,
    // @ts-ignore
    defaultValues: {
      ...getProductDefaultValues(initialValues!, isNewTranslation),
      shippingClass: !!shippingClasses?.length
        ? shippingClasses?.find(
            (shipping: Shipping) => shipping.id == initialValues?.shipping_class_id
          )
        : null,
    },
  });
  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    watch,
    formState: { errors },
    getValues,
  } = methods;

  const { mutate: createProduct, isLoading: creating } =
    useCreateProductMutation();
  const { mutate: updateProduct, isLoading: updating } =
    useUpdateProductMutation();

  const onSubmit = async (values: ProductFormValues) => {
    const inputValues = {
      language: router.locale,
      ...getProductInputValues({ ...values, ...input }, initialValues),
    };

    try {
      if (
        !initialValues ||
        !initialValues.translated_languages.includes(router.locale!)
      ) {
        //@ts-ignore
        createProduct({
          ...inputValues,
          ...(initialValues?.slug && { slug: initialValues.slug }),
          shop_id: shopId || initialValues?.shop_id,
          shipping_class_id: parseInt(values.shippingClass?.id || "0") || null,
        });
      } else {
        //@ts-ignore
        updateProduct({
          ...inputValues,
          id: initialValues.id!,
          shop_id: initialValues.shop_id!,          
          shipping_class_id: parseInt(values.shippingClass?.id || "0") || null,
        });
      }
    } catch (error) {
      const serverErrors = getErrorMessage(error);
      Object.keys(serverErrors?.validation).forEach((field: any) => {
        setError(field.split('.')[1], {
          type: 'manual',
          message: serverErrors?.validation[field][0],
        });
      });
    }
  };

  const product_type = watch('product_type');
  const is_digital = watch('is_digital');
  const is_external = watch('is_external');
  const slugAutoSuggest = join(split(watch('name'), ' '), '-').toLowerCase();

  /* const {
    onChange: onChangeUnit,
    onBlur: onBlurUnit,
    name: nameUnit,
    ref: refUnit,
  } = register('unit'); */

  const handleDescription = (e: any) => {
    setInput({
      ...input,
      description: e,
    });
  };

  /* const handleUnit = (e: any) => {
    onChangeUnit(e);
    console.log('eeeeeeeeeeeee', e?.target?.value);
    setValue("quantity", e?.target?.value.split(" ")[0])
  }; */

  return (
    <>
      {errorMessage ? (
        <Alert
          message={t(`common:${errorMessage}`)}
          variant="error"
          closeable={true}
          className="mt-5"
          onClose={() => setErrorMessage(null)}
        />
      ) : null}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
            <Description
              title={t('form:featured-image-title')}
              details={t('form:featured-image-help-text')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <FileInput name="image" control={control} multiple={false} />
            </Card>
          </div>

          <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
            <Description
              title={t('form:gallery-title')}
              details={t('form:gallery-help-text')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <FileInput name="gallery" control={control} />
            </Card>
          </div>

          <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
            <Description
              title={t('form:type-and-category')}
              details={t('form:type-and-category-help-text')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <ProductGroupInput
                control={control}
                error={t((errors?.type as any)?.message)}
              />
              <ProductCategoryInput control={control} setValue={setValue} />
              <ProductAuthorInput control={control} />
              <ProductManufacturerInput control={control} setValue={setValue} />
              <ProductTagInput control={control} setValue={setValue} />
            </Card>
          </div>

          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={t('form:item-description')}
              details={`${
                initialValues
                  ? t('form:item-description-edit')
                  : t('form:item-description-add')
              } ${t('form:product-description-help-text')}`}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <Input
                label={`${t('form:input-label-name')}*`}
                {...register('name')}
                error={t(errors.name?.message!)}
                variant="outline"
                className="mb-5"
              />

              {isSlugEditable ? (
                <div className="relative mb-5">
                  <Input
                    label={`${t('Slug')}`}
                    {...register('slug')}
                    error={t(errors.slug?.message!)}
                    variant="outline"
                    disabled={isSlugDisable}
                  />
                  <button
                    className="absolute top-[27px] right-px z-10 flex h-[46px] w-11 items-center justify-center rounded-tr rounded-br border-l border-solid border-border-base bg-white px-2 text-body transition duration-200 hover:text-heading focus:outline-none"
                    type="button"
                    title={t('common:text-edit')}
                    onClick={() => setIsSlugDisable(false)}
                  >
                    <EditIcon width={14} />
                  </button>
                </div>
              ) : (
                <Input
                  label={`${t('Slug')}`}
                  {...register('slug')}
                  value={slugAutoSuggest}
                  variant="outline"
                  className="mb-5"
                  disabled
                />
              )}

              <Input
                label={`${t('form:input-label-duration')}*`}
                {...register('unit')}
                error={t(errors.unit?.message!)}
                variant="outline"
                className="mb-5"
              />

              {/*  <Input
                onChange={handleUnit} // assign onChange event
                onBlur={onBlurUnit} // assign onBlur event
                name={nameUnit} // assign name prop
                ref={refUnit} // assign ref prop
                label={`${t('form:input-label-duration')}*`}
                error={t(errors.unit?.message!)}
                variant="outline"
                className="mb-5"
              /> */}

              <CKEditorComp
                name={'descriptionName'}
                /* onChange={(data: any) => {
                  setData(data);
                }} */
                onChange={handleDescription}
                editorLoaded={editorLoaded}
                value={input?.description}
                label={'Description'}
                className="mb-5"
              />

              {/* <TextArea
                label={t('form:input-label-description')}
                {...register('description')}
                error={t(errors.description?.message!)}
                variant="outline"
                className="mb-5"
              /> */}

              <div>
                <Label>{t('form:input-label-status')}</Label>
                <Radio
                  {...register('status')}
                  label={t('form:input-label-published')}
                  id="published"
                  value="publish"
                  className="mb-2"
                />
                <Radio
                  {...register('status')}
                  id="draft"
                  label={t('form:input-label-draft')}
                  value="draft"
                />
              </div>
            </Card>
          </div>

          <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
            <Description
              title={t('form:form-title-product-type')}
              details={t('form:form-description-product-type')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pr-4 md:w-1/3 md:pr-5"
            />

            <ProductTypeInput />
          </div>

          {/* Simple Type */}
          {product_type?.value === ProductType.Simple && (
            <ProductSimpleForm initialValues={initialValues} />
          )}

          {/* Variation Type */}
          {product_type?.value === ProductType.Variable && (
            <ProductVariableForm
              shopId={shopId}
              initialValues={initialValues}
            />
          )}

          <div className="my-5 flex flex-wrap sm:my-8">
            <Description
              title={'Shipping'}
              details={``}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div className="mb-5">
                <Label>{t('form:input-label-shipping-class')}</Label>
                <SelectInput
                  name="shippingClass"
                  control={control}
                  getOptionLabel={(option: any) => option.name}
                  getOptionValue={(option: any) => option.id}
                  options={shippingClasses!}
                />
              </div>
            </Card>
          </div>

          <div className="mb-4 text-end">
            {initialValues && (
              <Button
                variant="outline"
                onClick={router.back}
                className="me-4"
                type="button"
              >
                {t('form:button-label-back')}
              </Button>
            )}
            <Button loading={updating || creating}>
              {initialValues
                ? t('form:button-label-update-product')
                : t('form:button-label-add-product')}
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
}
